// admin.js
class AdminUI {
    static init() {
        this.bindEvents();
        this.checkAuthState();
    }

    static bindEvents() {
        // Autenticación
        document.getElementById('loginBtn').addEventListener('click', this.handleLogin);
        document.getElementById('logoutBtn').addEventListener('click', this.handleLogout);
        document.getElementById('addItemBtn').addEventListener('click', () => this.showModal());
        document.getElementById('itemForm').addEventListener('submit', this.saveItem);
        document.getElementById('searchInput').addEventListener('input', this.searchItems);
    }

    static async checkAuthState() {
        try {
            const user = await new Promise((resolve, reject) => {
                const unsubscribe = firebase.auth.onAuthStateChanged(user => {
                    unsubscribe();
                    resolve(user);
                }, reject);
            });

            if (user) {
                const isAdmin = await this.verifyAdminRole(user.uid);
                if (isAdmin) {
                    this.showInventory();
                    this.loadInventory();
                } else {
                    this.showAuthError('No tienes permisos de administrador');
                    await firebase.signOut(auth);
                }
            }
        } catch (error) {
            console.error('Error verifying auth:', error);
        }
    }

    static async verifyAdminRole(uid) {
        const adminDoc = await firebase.getDoc(firebase.doc(firebase.db, 'admins', uid));
        return adminDoc.exists();
    }

    static async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            await firebase.signInWithEmailAndPassword(firebase.auth, email, password);
        } catch (error) {
            this.showAuthError(this.getErrorMessage(error.code));
        }
    }

    static async handleLogout() {
        try {
            await firebase.signOut(firebase.auth);
            window.location.reload();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    static async loadInventory() {
        try {
            this.showLoading();
            const q = firebase.query(firebase.collection(firebase.db, 'inventory'));
            
            const unsubscribe = firebase.onSnapshot(q, (snapshot) => {
                const items = [];
                snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
                this.renderInventory(items);
                this.hideLoading();
            });

            window.addEventListener('beforeunload', unsubscribe);
        } catch (error) {
            this.showError('Error al cargar inventario');
        }
    }

    static renderInventory(items) {
        const tbody = document.getElementById('inventoryList');
        tbody.innerHTML = items.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.unit}</td>
                <td>${new Date(item.lastUpdate).toLocaleDateString()}</td>
                <td>
                    <button class="edit-btn" data-id="${item.id}">✏️</button>
                    <button class="delete-btn" data-id="${item.id}">🗑️</button>
                </td>
            </tr>
        `).join('');

        // Bind edit/delete events
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleEdit(btn.dataset.id));
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleDelete(btn.dataset.id));
        });
    }

    // Resto de métodos (showModal, saveItem, searchItems, etc)...
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => AdminUI.init());
