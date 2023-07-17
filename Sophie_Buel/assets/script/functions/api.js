import { alertElement } from "./dom.js";

/**
 * Fetches JSON data from the specified URL.
 * @param {string} url - The URL to fetch JSON from.
 * @param {object} options - The options for the fetch request.
 * @returns {Promise<Response|Object>} - A promise that resolves to the parsed JSON response or the response object itself.
 */
export async function fetchJSON(url, options = {}) {
    const headers = { Accept: "application/json", ...options.headers };
    const reply = await fetch(url, { ...options, headers });
    if (reply.ok) {
        return reply.json();
    } else {
        alertElement("Erreur serveur");
    }
    return reply;
}

/**
 * Fetches login data from the server.
 * @param {object} dataUser - The user data to be sent for login.
 * @returns {Promise<Response|Object>} - A promise that resolves to the parsed JSON response or the response object itself.
 */
export async function fetchLogin(dataUser) {
    const reply = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataUser),
    });
    if (reply.ok) {
        return reply.json();
    } else if (reply.status === 401) {
        alertElement("Mot de passe incorrect");
    } else {
        alertElement("L'adresse mail saisie, est incorrect");
    }
}

/**
 * Deletes an item from the server.
 * @param {number} id - The ID of the item to delete.
 * @returns {Promise<Response>} - A promise that resolves to the response object.
 */
export async function fetchDel(id) {
    const reply = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.user,
        },
    });
    console.log("del test api res", reply);
    return reply;
}

