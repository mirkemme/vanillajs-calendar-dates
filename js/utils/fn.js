import {
    bodyEl, todoList, todoTodayList, todoUpcomingList, todoPastList, currentDate, todayCardsContainerEl, upcomingCardsContainerEl, pastCardsContainerEl,
    priorityBtnEl, dateBtnEl, iconSortingPriorityEl, iconSortingDateEl
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

const showSortingPriorityIcon = (sorting) => {
    const iconEl = createEl("img", "");

    if (sorting === "descending") {
        iconEl.setAttribute("src", "./assets/icons/arrow-down.svg");
        iconEl.setAttribute("alt", "descending");
    } else if (sorting === "ascending") {
        iconSortingPriorityEl.textContent = "";
        iconEl.setAttribute("src", "./assets/icons/arrow-up.svg");
        iconEl.setAttribute("alt", "ascending");
    } else {
        iconSortingPriorityEl.textContent = "";
        return 0;
    }
    iconSortingPriorityEl.append(iconEl);
}

const showSortingDateIcon = (sorting) => {
    const iconEl = createEl("img", "");

    if (sorting === "descending") {
        iconEl.setAttribute("src", "../assets/icons/arrow-down.svg");
        iconEl.setAttribute("alt", "descending");
    } else if (sorting === "ascending") {
        iconSortingDateEl.textContent = "";
        iconEl.setAttribute("src", "../assets/icons/arrow-up.svg");
        iconEl.setAttribute("alt", "ascending");
    } else {
        iconSortingDateEl.textContent = "";
        return 0;
    }
    iconSortingDateEl.append(iconEl);
}

export const sortingByPriority = (sorting) => {
    todayCardsContainerEl.textContent = "";
    upcomingCardsContainerEl.textContent = "";
    pastCardsContainerEl.textContent = "";

    if (sorting === "none") renderTodoList();
    else {
        if (sorting === "descending") {
            todoTodayList.sort((item1, item2) => item2.priority - item1.priority);
            todoUpcomingList.sort((item1, item2) => item2.priority - item1.priority);
            todoPastList.sort((item1, item2) => item2.priority - item1.priority);
        } else if (sorting === "ascending") {
            todoTodayList.sort((item1, item2) => item1.priority - item2.priority);
            todoUpcomingList.sort((item1, item2) => item1.priority - item2.priority);
            todoPastList.sort((item1, item2) => item1.priority - item2.priority);
        }
        renderElements(todoTodayList, todayCardsContainerEl);
        renderElements(todoUpcomingList, upcomingCardsContainerEl);
        renderElements(todoPastList, pastCardsContainerEl);
    }
}

const sortingByDate = (sorting) => {
    upcomingCardsContainerEl.textContent = "";
    pastCardsContainerEl.textContent = "";

    if (sorting === "none") {
        todayCardsContainerEl.textContent = "";
        renderTodoList();
    }
    else {
        if (sorting === "descending") {
            todoUpcomingList.sort((item1, item2) => Date.parse(item2.date) - Date.parse(item1.date));
            todoPastList.sort((item1, item2) => Date.parse(item2.date) - Date.parse(item1.date));
        } else if (sorting === "ascending") {
            todoUpcomingList.sort((item1, item2) => Date.parse(item1.date) - Date.parse(item2.date));
            todoPastList.sort((item1, item2) => Date.parse(item1.date) - Date.parse(item2.date));
        }
        renderElements(todoUpcomingList, upcomingCardsContainerEl);
        renderElements(todoPastList, pastCardsContainerEl);
    }
}

/* Gestisce gli event listener associati ai pulsanti PRIORITY e DATE e chiama le funzioni per ordinare in base alla priorità o alla data
e le funzioni per visualizzare l'icona freccina accanto ai due pulsanti.
Volevo ottimizzare il codice riducendo il numero di funzioni ma non sono convinto che l'approccio che ho scelto per far gestire a una sola funzione entrambi gli eventi
sia il modo migliore, mi spiego meglio: 
gli argomenti (value1, value2, value3, value4) possono assumere i valori ("priority", "Priority", "date", "Date") oppure
("date", "Date", "priority", "Priority"), passati come parametri dagli event listener associati ai pulsanti "Priority" o "Date".
Usando eval(...) ho potuto utilizzare appunto solo una funzione per gestire entrambi i listener e accedere a variabili diverse a seconda appunto dei due casi.
Lo stesso approccio avrei potuto utilizzarlo con le funzioni che eseguono l'ordinamento e visualizzano l'icona freccina riducendo il numero da 4 a 2
ma mi sono reso conto che utilizzando eval() la leggibilità del codice cala notevolmente.*/
export const onHandleClick = (value1, value2, value3, value4) => {
    if (eval(`sorting${value4}ClickCounter`) != 0) { /* Verifico che l'altro pulsante sia inattivo. Se non lo è, azzero il suo contatore dei click e
    tolgo la sua icona freccina e il suo sfondo più scuro poichè solo uno dei due pulsanti deve essere attivo nello stesso momento. */
        eval(`sorting${value4}ClickCounter = 0`);
        eval(`${value3}BtnEl`).classList.remove("active");
        eval(`iconSorting${value4}El`).textContent = "";
    }
    eval(`++sorting${value2}ClickCounter`);
    if (eval(`sorting${value2}ClickCounter`) === 1) {   /* al primo click */
        eval(`${value1}BtnEl`).classList.add("active"); /* aggiungo al bottone cliccato uno sfondo più scuro */
        eval(`showSorting${value2}Icon`)("descending"); /* chiamo la funzione per mostrare l'icona freccina verso il basso */
        eval(`sortingBy${value2}`)("descending"); /* chiamo la funzione per ordinare in modo decrescente */
    }
    else if (eval(`sorting${value2}ClickCounter`) === 2) { /* al secondo click */
        eval(`showSorting${value2}Icon`)("ascending"); /* chiamo la funzione per mostrare l'icona freccina verso l'alto */
        eval(`sortingBy${value2}`)("ascending"); /* chiamo la funzione per ordinare in modo crescente */
    }
    else { /* al terzo click */
        eval(`showSorting${value2}Icon`)("none"); /* tolgo l'icona freccina */
        eval(`sortingBy${value2}`)("none"); /* chiamo la funzione per renderizzare la todoList arrivata dalla fetch */
        eval(`sorting${value2}ClickCounter = 0`); /* azzero il ocntatore dei click sul bottone */
        eval(`${value1}BtnEl`).classList.remove("active"); /* rimuovo lo sfondo scuro dal bottone */
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
