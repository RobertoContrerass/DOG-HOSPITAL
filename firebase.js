/* --------------------------------------------------------- 
   ✅ Firebase inicialización completa para Dog Hospital
   --------------------------------------------------------- */
   console.log("✅ firebase.js CARGÓ correctamente");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getFirestore, doc, getDoc, setDoc, updateDoc,
  collection, addDoc, deleteDoc, getDocs 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { 
  getStorage, ref, uploadBytes, getDownloadURL, deleteObject 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFii86Frh9_ydqW2u8aly3BGLuHqKzceY",
  authDomain: "dos-hospital.firebaseapp.com",
  projectId: "dos-hospital",
  storageBucket: "dos-hospital.appspot.com",
  messagingSenderId: "945869908529",
  appId: "1:945869908529:web:e125ddc6b9e3d128ff8310",
  measurementId: "G-FHDDC558B8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

console.log("🔥 Firebase inicializado correctamente - Dog Hospital");

/* ---------------------------------------------------------
   ✅ NORMALIZADOR DE ID (CORRECCIÓN PRINCIPAL)
   --------------------------------------------------------- */

function safeEmailID(email) {
  return email.replace(/[.#$/[\]@]/g, "_");
}

/* ---------------------------------------------------------
   ✅ USUARIOS
   --------------------------------------------------------- */

export async function registrarUsuario(email, data) {
  const id = safeEmailID(email);
  await setDoc(doc(db, "usuarios", id), data, { merge: true });
  console.log("✅ Usuario guardado:", id);
  console.log("📁 Intentando escribir en Firestore → usuarios / " + id);
}

export async function cargarUsuario(email) {
  const id = safeEmailID(email);
  const snap = await getDoc(doc(db, "usuarios", id));
  return snap.exists() ? snap.data() : null;
}

export async function actualizarUsuario(email, data) {
  const id = safeEmailID(email);
  await updateDoc(doc(db, "usuarios", id), data);
  console.log("✅ Usuario actualizado:", id);
}

/* ---------------------------------------------------------
   ✅ MASCOTAS
   --------------------------------------------------------- */

export async function agregarMascota(email, mascotaData) {
  const id = safeEmailID(email);
  const colRef = collection(db, "usuarios", id, "mascotas");
  const docu = await addDoc(colRef, mascotaData);
  console.log("✅ Mascota agregada:", docu.id);
  return docu.id;
}

export async function actualizarMascota(email, idMascota, data) {
  const uid = safeEmailID(email);
  await updateDoc(doc(db, "usuarios", uid, "mascotas", idMascota), data);
  console.log("✅ Mascota actualizada:", idMascota);
}

export async function cargarMascotas(email) {
  const id = safeEmailID(email);
  const colRef = collection(db, "usuarios", id, "mascotas");
  const snap = await getDocs(colRef);

  let lista = [];
  snap.forEach(doc => lista.push({ id: doc.id, ...doc.data() }));
  return lista;
}

export async function eliminarMascota(email, idMascota) {
  const id = safeEmailID(email);
  await deleteDoc(doc(db, "usuarios", id, "mascotas", idMascota));
  console.log("❌ Mascota eliminada:", idMascota);
}

/* ---------------------------------------------------------
   ✅ OBTENER MASCOTA POR ID GLOBALMENTE (para QR)
   --------------------------------------------------------- */
export async function obtenerMascotaPorId(idMascotaBuscada) {
  try {
    // Obtener todos los usuarios
    const usuariosSnap = await getDocs(collection(db, "usuarios"));
    
    for (const usuarioDoc of usuariosSnap.docs) {
      const mascotasCol = collection(db, "usuarios", usuarioDoc.id, "mascotas");
      const mascotasSnap = await getDocs(mascotasCol);

      for (const mascotaDoc of mascotasSnap.docs) {
        if (mascotaDoc.id === idMascotaBuscada) {
          console.log("✅ Mascota encontrada en usuario:", usuarioDoc.id);
          return { id: mascotaDoc.id, ...mascotaDoc.data() };
        }
      }
    }

    console.warn("⚠️ No se encontró ninguna mascota con ID:", idMascotaBuscada);
    return null;

  } catch (error) {
    console.error("❌ Error buscando mascota global:", error);
    return null;
  }
}

/* ---------------------------------------------------------
   ✅ STORAGE (FOTOS)
   --------------------------------------------------------- */

export async function subirFoto(ruta, archivo) {
  const archivoRef = ref(storage, ruta);
  await uploadBytes(archivoRef, archivo);
  return await getDownloadURL(archivoRef);
}

export async function borrarFoto(ruta) {
  const archivoRef = ref(storage, ruta);
  await deleteObject(archivoRef);
}

/* ---------------------------------------------------------
   ✅ CITAS
   --------------------------------------------------------- */

export async function registrarCita(email, cita) {
  const id = safeEmailID(email);
  const colRef = collection(db, "usuarios", id, "citas");
  const docu = await addDoc(colRef, cita);
  return docu.id;
}

export async function cargarCitas(email) {
  const id = safeEmailID(email);
  const colRef = collection(db, "usuarios", id, "citas");
  const snap = await getDocs(colRef);

  let lista = [];
  snap.forEach(doc => lista.push({ id: doc.id, ...doc.data() }));
  return lista;
}

export async function eliminarCita(email, idCita) {
  const id = safeEmailID(email);
  await deleteDoc(doc(db, "usuarios", id, "citas", idCita));
}

/* ---------------------------------------------------------
   ✅ HACER FUNCIONES GLOBALES
   --------------------------------------------------------- */

window.firebaseDog = {
  registrarUsuario,
  cargarUsuario,
  actualizarUsuario,

  agregarMascota,
  actualizarMascota,
  cargarMascotas,
  eliminarMascota,
  obtenerMascotaPorId,

  registrarCita,
  cargarCitas,
  eliminarCita,

  subirFoto,
  borrarFoto,
  
  safeEmailID
};

console.log("✅ Funciones Firebase listas en window.firebaseDog");
