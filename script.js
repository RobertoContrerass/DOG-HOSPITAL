document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const errorMsg = document.getElementById('error-msg');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Simulación: credenciales válidas
    const validEmail = "usuario@doghospital.com";
    const validPassword = "12345";

    if (email === validEmail && password === validPassword) {
      // Guardamos el usuario en el almacenamiento local
      localStorage.setItem("usuarioActivo", JSON.stringify({
        nombre: "Angel López",
        correo: email,
        foto: "foto-usuario.jpg"
      }));

      // Redirige al perfil
      window.location.href = "perfil.html";
    } else {
      errorMsg.textContent = "Correo o contraseña incorrectos.";
      errorMsg.style.color = "red";
    }
  });
});
