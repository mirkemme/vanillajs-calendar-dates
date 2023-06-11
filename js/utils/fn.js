import {
    bodyEl, todoList, todoTodayList, todoUpcomingList, todoPastList, currentDate, todayCardsContainerEl, upcomingCardsContainerEl, pastCardsContainerEl,
    filterBtnEl, iconSortingPriorityEl, iconSortingDateEl, priorityBtnEl, dateBtnEl
} from "../script.js";

export const qS = (type) => document.querySelector(type);
export const qSA = (type) => document.querySelectorAll(type);
let sortingPriorityClickCounter = 0;
let sortingDateClickCounter = 0;

export const createEl = (type, content, ...attrs) => {
    const element = document.createElement(type);

    element.textContent = content;
    attrs.forEach((attr) => element.setAttribute(attr?.name, attr?.value));
    return element;
}

export const getRandomDate = (startDate, endDate) => {
    const timeDiff = endDate.getTime() - startDate.getTime();
    const randomTime = Math.random() * timeDiff;
    const randomDate = new Date(startDate.getTime() + randomTime);

    return randomDate.toISOString().slice(0, 10);
}

export const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const cardGen = ({ priority = "Not specified", date = "Not specified", title = "Not specified" }) => {
    const cardWrapperEl = createEl("div", "", { name: "class", value: "card__wrapper" });
    const cardInfoEls = createEl("div", "", { name: "class", value: "card__info" });
    const priorityEl = createEl("div", "Priority: ", { name: "class", value: "card__priority" });
    const priorityValueEl = createEl("p", priority, { name: "class", value: "card__priority__value" });
    const dateEl = createEl("p", date.split("-").reverse().join("/"), { name: "class", value: "card__date" });
    const titleEl = createEl("h4", title, { name: "class", value: "card__title" });

    priorityEl.append(priorityValueEl);
    cardInfoEls.append(priorityEl, dateEl);
    cardWrapperEl.append(cardInfoEls, titleEl);

    return cardWrapperEl;
}

export const renderElements = (todoItems, listEl) => {
    todoItems.forEach((todo) => listEl.appendChild(cardGen(todo)));
}

const renderTodoList = () => {
    if (todoTodayList.length !== 0)
        todayCardsContainerEl.textContent = "";
    if (todoUpcomingList.length !== 0)
        upcomingCardsContainerEl.textContent = "";
    if (todoPastList.length !== 0)
        pastCardsContainerEl.textContent = "";
    todoList.forEach((todo) => {
        if (todo.date === currentDate) {
            todayCardsContainerEl.append(cardGen(todo));
        }
        else if (todo.date > currentDate) {
            upcomingCardsContainerEl.append(cardGen(todo));
        } else {
            pastCardsContainerEl.append(cardGen(todo));
        }
    })
}

const showSortingIcon = (sortingType, type) => {
    const iconEl = createEl("img", "");

    if (sortingType === "descending") {
        iconEl.setAttribute("src", "./assets/icons/arrow-down.svg");
        iconEl.setAttribute("alt", "descending");
    } else if (sortingType === "ascending") {
        eval(`iconSorting${type}El`).textContent = "";
        iconEl.setAttribute("src", "./assets/icons/arrow-up.svg");
        iconEl.setAttribute("alt", "ascending");
    } else {
        eval(`iconSorting${type}El`).textContent = "";
        return 0;
    }
    eval(`iconSorting${type}El`).append(iconEl);
}

const sortingFn = (sorting, sortingType) => {
    if (sorting === "none") {
        renderTodoList();
    } else {
        if (sorting === "descending") {
            if (sortingType === "priority")
                if (todoTodayList.length !== 0) {
                    todayCardsContainerEl.textContent = "";
                    todoTodayList.sort((item1, item2) => item2.priority - item1.priority);
                }
            if (todoUpcomingList.length !== 0) {
                upcomingCardsContainerEl.textContent = "";
                if (sortingType === "priority")
                    todoUpcomingList.sort((item1, item2) => item2.priority - item1.priority);
                else
                    todoUpcomingList.sort((item1, item2) => Date.parse(item2.date) - Date.parse(item1.date));
            }
            if (todoPastList.length !== 0) {
                pastCardsContainerEl.textContent = "";
                if (sortingType === "priority")
                    todoPastList.sort((item1, item2) => item2.priority - item1.priority);
                else
                    todoPastList.sort((item1, item2) => Date.parse(item2.date) - Date.parse(item1.date));
            }
        } else if (sorting === "ascending") {
            if (sortingType === "priority")
                if (todoTodayList.length !== 0) {
                    todayCardsContainerEl.textContent = "";
                    todoTodayList.sort((item1, item2) => item1.priority - item2.priority);
                }
            if (todoUpcomingList.length !== 0) {
                upcomingCardsContainerEl.textContent = "";
                if (sortingType === "priority")
                    todoUpcomingList.sort((item1, item2) => item1.priority - item2.priority);
                else
                    todoUpcomingList.sort((item1, item2) => Date.parse(item1.date) - Date.parse(item2.date));
            }
            if (todoPastList.length !== 0) {
                pastCardsContainerEl.textContent = "";
                if (sortingType === "priority")
                    todoPastList.sort((item1, item2) => item1.priority - item2.priority);
                else
                    todoPastList.sort((item1, item2) => Date.parse(item1.date) - Date.parse(item2.date));
            }
        }
        if (sortingType === "priority")
            renderElements(todoTodayList, todayCardsContainerEl);
        renderElements(todoUpcomingList, upcomingCardsContainerEl);
        renderElements(todoPastList, pastCardsContainerEl);
    }
}

/* Chiama le funzioni per ordinare in base alla priorità o alla data e la funzione per visualizzare l'icona freccina accanto ai due pulsanti.
value1 assume valore "Priority" e value2 "Date" se "onHandlerClick" cattura l'evento "click sul bottone Priority",
altrimenti i valori sono invertiti */
const handlerTarget = (value1, value2) => {
    if (eval(`sorting${value2}ClickCounter`) != 0) { /* Verifico che l'altro pulsante sia inattivo. Se non lo è, azzero il suo contatore dei click e
    tolgo la sua icona freccina e il suo sfondo più scuro poichè solo uno dei due pulsanti deve essere attivo nello stesso momento. */
        eval(`sorting${value2}ClickCounter = 0`);
        eval(`${value2}`.toLowerCase() + "BtnEl").classList.remove("active");
        eval(`iconSorting${value2}El`).textContent = "";
    }
    eval(`++sorting${value1}ClickCounter`);
    if (eval(`sorting${value1}ClickCounter`) === 1) {   /* al primo click */
        eval(`${value1}`.toLowerCase() + "BtnEl").classList.add("active"); /* aggiungo al bottone cliccato uno sfondo più scuro */
        showSortingIcon("descending", value1); /* chiamo la funzione per mostrare l'icona freccina verso il basso */
        sortingFn("descending", value1.toLowerCase()); /* chiamo la funzione per ordinare in modo decrescente */
    }
    else if (eval(`sorting${value1}ClickCounter`) === 2) { /* al secondo click */
        showSortingIcon("ascending", value1); /* chiamo la funzione per mostrare l'icona freccina verso l'alto */
        sortingFn("ascending", value1.toLowerCase()); /* chiamo la funzione per ordinare in modo crescente */
    }
    else { /* al terzo click */
        showSortingIcon("none", value1); /* tolgo l'icona freccina */
        sortingFn("none", value1.toLowerCase()); /* chiamo la funzione per renderizzare la todoList arrivata dalla fetch */
        eval(`sorting${value1}ClickCounter = 0`); /* azzero il contatore dei click sul bottone */
        eval(`${value1}`.toLowerCase() + "BtnEl").classList.remove("active"); /* rimuovo lo sfondo scuro dal bottone */
    }
}

export const onHandlerClick = () => {
    if (event.target.textContent === "Priority") /* Se il click è avvenuto sul pulsate "Priority" */
        handlerTarget(event.target.textContent, "Date");
    else { /* Se il click è avvenuto sul pulsate "Date" */
        handlerTarget(event.target.textContent, "Priority");
    }
}

/* visualizza una modale con un messaggio nel caso dalla fetch non arrivi nessuna risposta */
export const listNotFoundModalGen = (error) => {
    const modalEl = createEl("div", "", { name: "class", value: "listNotFoundModal" });
    const titleEl = createEl("h4", error.message);

    modalEl.appendChild(titleEl);
    bodyEl.appendChild(modalEl);
}

/* visualizza un messaggio nel caso non ci siano appuntamenti in programma per "Oggi" o "Futuri" */
export const noAppointmentsMessage = (type) => {
    const messageEl = createEl("p", "");
    if (type === "today")
        messageEl.textContent = "Nessun appuntamento per oggi.";
    else {
        if (type === "upcoming")
            messageEl.textContent = "Nessun appuntamento previsto per i prossimi giorni.";
    }
    return messageEl;
}