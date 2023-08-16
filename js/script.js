import { GET } from "./utils/http.js";
import {
    cardGen, qS, getRandomDate, randomNumber, onHandlerClick, listNotFoundModalGen,
    noAppointmentsMessage,
    qSA
} from "./utils/fn.js";

export const bodyEl = qS("body");
export const rootEl = qS("#root");
export const appointmentsTodayContainerEl = qS(".appointments_today");
export const appointmentsUpcomingContainerEl = qS(".appointments_upcoming");
export const appointmentsPastContainerEl = qS(".appointments_past");
export const todayCardsContainerEl = qS(".todayCardsContainer");
export const upcomingCardsContainerEl = qS(".upcomingCardsContainer");
export const pastCardsContainerEl = qS(".pastCardsContainer");
export const priorityBtnEl = qS(".filter__priority__wrapper");
export const dateBtnEl = qS(".filter__date__wrapper");
export const filterBtnEl = qSA(".filter__text");
export const iconSortingPriorityEl = qS(".priority__icon");
export const iconSortingDateEl = qS(".date__icon");
const startDate = new Date('2023-08-01'); /* costanti per determinare l'intervallo di date da utilizzare per generare le date casuali */
const endDate = new Date('2023-12-31');
const minPriority = 1;
const maxPriority = 4;
export let todoList = [];
export let todoTodayList = [];
export let todoUpcomingList = [];
export let todoPastList = [];
export let currentDate = new Date().toISOString().slice(0, 10);

/* ASYNC */
let remoteData = GET("");
remoteData
    .then((data) => {
        if (data.message === "Response failed!") {
            throw new Error("Appuntamenti non trovati");
        } else todoList = data;
    })
    .then(() => {
        todoList.map((user) => {
            user.date = getRandomDate(startDate, endDate);
            user.priority = randomNumber(minPriority, maxPriority);
            return user;
        }).forEach((todo) => {
            if (todo.date === currentDate) {
                todayCardsContainerEl.append(cardGen(todo));
                todoTodayList.push(todo);
            }
            else if (todo.date > currentDate) {
                upcomingCardsContainerEl.append(cardGen(todo));
                todoUpcomingList.push(todo);
            } else {
                pastCardsContainerEl.append(cardGen(todo));
                todoPastList.push(todo);
            }
        })
    })
    .then(() => {
        if (todoTodayList.length === 0) {
            todayCardsContainerEl.appendChild(noAppointmentsMessage("today"));
        }
        if (todoUpcomingList.length === 0) {
            upcomingCardsContainerEl.appendChild(noAppointmentsMessage("upcoming"));
        }
        if (todoPastList.length === 0) {
            appointmentsTodayContainerEl.classList.add("resize");
            appointmentsUpcomingContainerEl.classList.add("resize");
            appointmentsPastContainerEl.classList.add("hidden");
        }
    })
    .catch((error) => listNotFoundModalGen(error));

/* LISTENERS */
filterBtnEl.forEach((item) => item.addEventListener("click", onHandlerClick));
