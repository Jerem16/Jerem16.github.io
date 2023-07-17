import { fetchLogin } from "./functions/api.js";
import { getElByID, getElSelect } from "./functions/dom.js";

/**
 * Définit l'élément de connexion comme actif et lui ajoute la classe "active".
 */
 const login = getElSelect("header nav li:nth-child(3)");
 login.setAttribute("data", "active");
 login.classList.add("active");
 
 /**
  * Gère l'action de connexion.
  */
 function logIn() {
   getElSelect(".login-form").addEventListener("submit", handleLogin);
 }
 
 logIn();
 
 /**
  * Effectue l'authentification en utilisant les informations de connexion fournies.
  * @returns {Promise<void>} Une promesse qui se résout lorsque l'authentification est réussie.
  */
 async function authentication() {
   const username = getElByID("login_mail").value;
   const password = getElByID("password").value;
   const dataUser = {
     email: username,
     password: password,
   };
 
   const response = await fetchLogin(dataUser);
   const userKey = response.token;
   window.localStorage.setItem("user", userKey);
   document.location.href = "edit.html";
 }
 
 /**
  * Gère la soumission du formulaire de connexion.
  * @param {Event} event - L'événement de soumission du formulaire.
  */
 function handleLogin(event) {
   event.preventDefault();
   authentication().catch((e) => {
     throw new Error("Erreur serveur", { cause: e });
   });
 }
 
