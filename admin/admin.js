// admin.js
// Configuración de Firebase (Sustituir con tus datos)
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROYECTO.firebaseapp.com",
    projectId: "TU_PROYECTO",
    storageBucket: "TU_PROYECTO.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Variables globales
let currentUser = null;
let editingItemId = null;

// Función de login
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            currentUser = userCredential.user;
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('inventoryContainer').style.display = 'block';
            loadInventory();
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
}

// Función de logout
function logout() {
    auth.signOut().then(() => {
        currentUser = null;
        document.getElementById('loginContainer').style.display = 'block';
        document.getElementById('inventoryContainer').style.display = 'none';
    });
}

// Cargar inventario
function loadInventory() {
    db.collection('inventory').onSnapshot((snapshot) => {
        const inventoryList = document.getElementById('inventoryList');
        inventoryList.innerHTML = '';
        
        snapshot.forEach(doc => {
            const item = doc.data();
            const itemHtml = `
                <div class="inventory-item">
                    <div>
                        <strong>${item.name}</strong><br>
                        ${item.quantity} ${item.unit}
                    </div>
                    <div>
                        <button onclick="editItem('${doc.id}')">✏️</button>
                        <button onclick="deleteItem('${doc.id}')">🗑️</button>
                    </div>
                </div>
            `;
            inventoryList.innerHTML += itemHtml;
        });
    });
}

// Funciones CRUD
function showAddModal() {
    editingItemId = null;
    document.getElementById('itemModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('itemModal').style.display = 'none';
}

function saveItem() {
    const item = {
        name: document.getElementById('itemName').value,
        quantity: Number(document.getElementById('itemQuantity').value),
        unit: document.getElementById('itemUnit').value,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    if(editingItemId) {
        db.collection('inventory').doc(editingItemId).update(item);
    } else {
        db.collection('inventory').add(item);
    }
    
    closeModal();
}

function editItem(id) {
    editingItemId = id;
    db.collection('inventory').doc(id).get().then(doc => {
        const data = doc.data();
        document.getElementById('itemName').value = data.name;
        document.getElementById('itemQuantity').value = data.quantity;
        document.getElementById('itemUnit').value = data.unit;
        document.getElementById('itemModal').style.display = 'block';
    });
}

function deleteItem(id) {
    if(confirm("¿Estás seguro de eliminar este insumo?")) {
        db.collection('inventory').doc(id).delete();
    }
}

// Escuchar cambios de autenticación
auth.onAuthStateChanged(user => {
    if(user) {
        currentUser = user;
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('inventoryContainer').style.display = 'block';
        loadInventory();
    }
});