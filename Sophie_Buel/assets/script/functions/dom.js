/**Crée et retourne un nouvel élément HTML avec les attributs spécifiés et le contenu texte optionnel.
 * @param {string} tagName - Le nom de la balise HTML de l'élément à créer.
 * @param {Object} attributes - Les attributs de l'élément à créer sous forme d'un objet clé-valeur.
 * @param {string} [textContent=""] - Le contenu texte optionnel à ajouter à l'élément créé.
 * @returns {HTMLElement} L'élément HTML créé. */
function createElement(tagName, attributes = {}, textContent = "") {

    /**L'élément HTML nouvellement créé.
     * @type {HTMLElement}  */
    const element = document.createElement(tagName);

    /**Applique les attributs spécifiés à l'élément créé.
     * @param {string} attribute - Le nom de l'attribut à définir.
     * @param {string} value - La valeur de l'attribut à définir. */
    Object.entries(attributes).forEach(([attribute, value]) => {
        if (value !== null) {
            element.setAttribute(attribute, value);
        }
    });

    if (textContent) {
        element.textContent = textContent;
    }
    
    return element;
}

/**Crée un élément d'alerte avec un message spécifié.
 * @param {string} message - Le message de l'alerte.
 * @returns {HTMLElement} L'élément d'alerte créé. */
 function alertElement(message) {
    /**L'élément d'alerte nouvellement créé.
     * @type {HTMLElement} */
    const alertElement = createElement("div", {
        class: "alert alert-danger m-2",
        role: "alert",
    });

    /**L'élément d'information de l'alerte.
     * @type {HTMLElement} */
    const info = createElement("div", {});
    info.innerText = message;
    alertElement.append(info);

    /**Le bouton de fermeture de l'alerte.
     * @type {HTMLElement} */
    const button = createElement("button", {});
    button.innerHTML = `&#x2716`;
    alertElement.append(button);

    document.body.prepend(alertElement);

    const end = document.querySelector("button");
    end.addEventListener("click", (e) => {
        e.preventDefault();
        alertElement.remove();
        alertElement.dispatchEvent(new CustomEvent("close"));
    });

    return alertElement;
}

/**Récupère un élément du DOM en utilisant son ID.
 * @param {string} id - L'ID de l'élément à récupérer.
 * @returns {HTMLElement|null} - L'élément du DOM correspondant à l'ID spécifié, ou null si aucun élément n'est trouvé. */
function getElByID(id) {
    return document.getElementById(id);
}

/**Récupère le premier élément correspondant au sélecteur spécifié.
 * @param {string} selector - Le sélecteur CSS de l'élément à récupérer.
 * @returns {HTMLElement|null} - L'élément du DOM correspondant au sélecteur spécifié, ou null si aucun élément n'est trouvé.*/
const getElSelect = (selector) => document.querySelector(selector);
const getElSelectAll = (selector) => document.querySelectorAll(selector);

export { createElement, alertElement, getElByID, getElSelect, getElSelectAll };
