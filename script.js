// ======================================================
// FIREBASE
// ======================================================

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getFirestore,
    doc,
    onSnapshot,
    runTransaction,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// ======================================================
// НАСТРОЙКИ FIREBASE
// ВСТАВЬ СЮДА СВОИ ДАННЫЕ ИЗ FIREBASE
// ======================================================

const firebaseConfig = {

    apiKey: "ВСТАВЬ_API_KEY",

    authDomain: "ВСТАВЬ_AUTH_DOMAIN",

    projectId: "ВСТАВЬ_PROJECT_ID",

    storageBucket: "ВСТАВЬ_STORAGE_BUCKET",

    messagingSenderId: "ВСТАВЬ_MESSAGING_SENDER_ID",

    appId: "ВСТАВЬ_APP_ID"
};

// ======================================================
// ЗАПУСК FIREBASE
// ======================================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// ======================================================
// ЭЛЕМЕНТЫ СТРАНИЦЫ
// ======================================================

const administrator =
    document.getElementById("administrator");

const dateInput =
    document.getElementById("schedule-date");

const counter =
    document.querySelector(".selected-counter strong");

const scheduleDate =
    document.querySelector(".schedule-header p");

const resetButton =
    document.getElementById("reset-button");

const buttons =
    document.querySelectorAll(".select-button");

const syncStatus =
    document.getElementById("sync-status");

// ======================================================
// ТЕКУЩИЕ ДАННЫЕ
// ======================================================

let selectedIntervals = {};

let unsubscribe = null;

// ======================================================
// ПАРОЛЬ СБРОСА
//
// ВАЖНО:
// Это только временная защита интерфейса.
// Для настоящей защиты позже подключим Firebase Auth.
// ======================================================

const RESET_PASSWORD = "12345";

// =====================
Вход – Google Аккаунты
accounts.google.com


=================================
// ЛИМИТЫ
// ======================================================

const INTERVAL_CAPACITIES = {

    "06:00-08:00": 2,

    "08:00-11:00": 3,

    "11:00-13:00": 4,

    "13:00-16:00": 4,

    "16:00-19:00": 4,

    "19:00-21:00": 5,

    "21:00-00:00": 3,

    "00:00-02:00": 3
};

// ======================================================
// НАЗВАНИЯ МЕСЯЦЕВ / ДАТА
// ======================================================

function updateDateText() {

    if (!dateInput.value) {
        return;
    }

    const date =
        new Date(dateInput.value + "T00:00:00");

    const formattedDate =
        date.toLocaleDateString(
            "ru-RU",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    scheduleDate.textContent =
        formattedDate + " года";
}

// ======================================================
// ПОЛУЧЕНИЕ ССЫЛКИ НА ДОКУМЕНТ FIRESTORE
//
// Например:
//
// schedules
//      2026-09-28
//          intervals
// ======================================================

function getScheduleReference() {

    return doc(
        db,
        "schedules",
        dateInput.value
    );
}

// ======================================================
// ВМЕСТИМОСТЬ
// ======================================================

function getOriginalCapacity(button) {

    const interval =
        button.dataset.interval;

    return INTERVAL_CAPACITIES[interval] || 3;
}

// ======================================================
// СКЛОНЕНИЕ "МЕСТО"
// ======================================================

function getPlaceWord(number) {

    if (
        number % 10 === 1 &&
        number % 100 !== 11
    ) {
        return "место";
    }

    if (
        number % 10 >= 2 &&
        number % 10 <= 4 &&
        (
            number % 100 < 10 ||
            number % 100 >= 20
        )
    ) {
        return "места";
    }

    return "мест";
}

// ======================================================
// ОТРИСОВКА ГРАФИКА
// ======================================================

function renderSchedule() {

    buttons.forEach(button => {

        const interval =
            button.dataset.interval;

        const block =
            button.closest(".time-block");

        const adminsContainer =
            block.querySelector(".admins");

        const capacityElement =
            block.querySelector(".capacity");

        const max =
            getOriginalCapacity(button);

        const admins =
            selectedIntervals[interval] || [];

        adminsContainer.innerHTML = "";

        // ----------------------------------------------
        // ПОКАЗЫВАЕМ АДМИНИСТРАТОРОВ
        // ----------------------------------------------

        admins.forEach(adminName => {

            const adminElement =
                document.createElement("span");

            adminElement.className = "admin";

            adminElement.textContent = adminName;

            adminsContainer.appendChild(
                adminElement
            );

        });

        // ----------------------------------------------
        // СВОБОДНЫЕ МЕСТА
        // ----------------------------------------------

        const freePlaces =
            max - admins.length;

        if (freePlaces > 0) {

            const freeElement =
                document.createElement("span");

            freeElement.className = "free";

            freeElement.textContent =
                `Свободно ${freePlaces} ${getPlaceWord(freePlaces)}`;

            adminsContainer.appendChild(
                freeElement
            );
        }

        // ----------------------------------------------
        // СЧЕТЧИК
        // ----------------------------------------------

        capacityElement.textContent =
            `${admins.length} / ${max}`;

        // ----------------------------------------------
        // СОСТОЯНИЕ К


НОПКИ
        // ----------------------------------------------

        const selectedAdmin =
            administrator.value;

        const adminAlreadySelected =
            selectedAdmin &&
            admins.includes(selectedAdmin);

        if (adminAlreadySelected) {

            button.textContent =
                "Снять";

            button.classList.remove("full");

            button.classList.add("selected");

            button.disabled = false;

        }

        else if (admins.length >= max) {

            button.textContent =
                "Заполнено";

            button.classList.add("full");

            button.classList.remove("selected");

            button.disabled = true;

        }

        else {

            button.textContent =
                "Выбрать";

            button.classList.remove("full");

            button.classList.remove("selected");

            button.disabled = false;
        }

    });

    updateCounter();

    updateDateText();
}

// ======================================================
// СЧЕТЧИК ВСЕХ ЗАНЯТЫХ МЕСТ
// ======================================================

function updateCounter() {

    let count = 0;

    Object.values(
        selectedIntervals
    ).forEach(admins => {

        if (Array.isArray(admins)) {
            count += admins.length;
        }

    });

    counter.textContent = count;
}

// ======================================================
// ПОДКЛЮЧЕНИЕ К ГРАФИКУ
//
// onSnapshot следит за базой в реальном времени.
//
// Если другой человек что-то изменил,
// данные автоматически придут сюда.
// ======================================================

function subscribeToSchedule() {

    // Отключаем старую подписку
    if (unsubscribe) {

        unsubscribe();

        unsubscribe = null;
    }

    if (!dateInput.value) {
        return;
    }

    if (syncStatus) {
        syncStatus.textContent =
            "Загрузка...";
    }

    const scheduleRef =
        getScheduleReference();

    unsubscribe =
        onSnapshot(

            scheduleRef,

            snapshot => {

                if (snapshot.exists()) {

                    const data =
                        snapshot.data();

                    selectedIntervals =
                        data.intervals || {};

                }

                else {

                    selectedIntervals = {};

                }

                renderSchedule();

                if (syncStatus) {

                    syncStatus.textContent =
                        "Синхронизировано";
                }

            },

            error => {

                console.error(
                    "Ошибка Firestore:",
                    error
                );

                if (syncStatus) {

                    syncStatus.textContent =
                        "Ошибка подключения";
                }

            }
        );
}

// ======================================================
// ДОБАВЛЕНИЕ АДМИНИСТРАТОРА
// ======================================================

async function addAdministratorToInterval(
    admin,
    interval,
    maxCapacity
) {

    const scheduleRef =
        getScheduleReference();

    await runTransaction(
        db,

        async transaction => {

            const snapshot =
                await transaction.get(
                    scheduleRef
                );

            let intervals = {};

            if (snapshot.exists()) {

                intervals =
                    snapshot.data().intervals || {};
            }

            // Копируем объект
            intervals = {
                ...intervals
            };

            const currentAdmins =
                Array.isArray(
                    intervals[interval]
                )
                    ? [...intervals[interval]]
                    : [];

            // ------------------------------------------
            // УЖЕ ЗАПИСАН
            // ----------------------


--------------------

            if (
                currentAdmins.includes(admin)
            ) {

                throw new Error(
                    "ALREADY_SELECTED"
                );
            }

            // ------------------------------------------
            // НЕТ МЕСТ
            // ------------------------------------------

            if (
                currentAdmins.length >=
                maxCapacity
            ) {

                throw new Error(
                    "INTERVAL_FULL"
                );
            }

            // ------------------------------------------
            // ДОБАВЛЯЕМ
            // ------------------------------------------

            currentAdmins.push(admin);

            intervals[interval] =
                currentAdmins;

            transaction.set(

                scheduleRef,

                {
                    intervals: intervals,
                    updatedAt:
                        new Date().toISOString()
                },

                {
                    merge: true
                }
            );

        }
    );
}

// ======================================================
// УДАЛЕНИЕ АДМИНИСТРАТОРА ИЗ ИНТЕРВАЛА
// ======================================================

async function removeAdministratorFromInterval(
    admin,
    interval
) {

    const scheduleRef =
        getScheduleReference();

    await runTransaction(

        db,

        async transaction => {

            const snapshot =
                await transaction.get(
                    scheduleRef
                );

            if (!snapshot.exists()) {
                return;
            }

            let intervals = {

                ...snapshot.data().intervals

            };

            const currentAdmins =
                Array.isArray(
                    intervals[interval]
                )
                    ? [...intervals[interval]]
                    : [];

            const updatedAdmins =
                currentAdmins.filter(
                    name => name !== admin
                );

            // Если никого не осталось
            if (updatedAdmins.length === 0) {

                delete intervals[interval];

            }

            else {

                intervals[interval] =
                    updatedAdmins;
            }

            transaction.set(

                scheduleRef,

                {
                    intervals: intervals,
                    updatedAt:
                        new Date().toISOString()
                },

                {
                    merge: true
                }
            );

        }
    );
}

// ======================================================
// НАЖАТИЕ НА ИНТЕРВАЛ
// ======================================================

buttons.forEach(button => {

    button.addEventListener(
        "click",

        async function () {

            const admin =
                administrator.value;

            // ------------------------------------------
            // АДМИН НЕ ВЫБРАН
            // ------------------------------------------

            if (!admin) {

                alert(
                    "Сначала выберите администратора."
                );

                return;
            }

            const interval =
                this.dataset.interval;

            const maxCapacity =
                getOriginalCapacity(this);

            const currentAdmins =
                selectedIntervals[interval] || [];

            // Блокируем кнопку,
            // пока идёт запрос

            this.disabled = true;

            const oldText =
                this.textContent;

            this.textContent =
                "Подождите...";

            try {

                // --------------------------------------
                // ЕСЛИ УЖЕ В ИНТЕРВАЛЕ — СНЯТЬ
                // --------------------------------------

                if (
                    curren


tAdmins.includes(admin)
                ) {

                    await removeAdministratorFromInterval(
                        admin,
                        interval
                    );

                    return;
                }

                // --------------------------------------
                // ИНАЧЕ ДОБАВЛЯЕМ
                // --------------------------------------

                await addAdministratorToInterval(
                    admin,
                    interval,
                    maxCapacity
                );

            }

            catch (error) {

                console.error(error);

                if (
                    error.message ===
                    "ALREADY_SELECTED"
                ) {

                    alert(
                        "Этот администратор уже выбран на данный интервал."
                    );

                }

                else if (
                    error.message ===
                    "INTERVAL_FULL"
                ) {

                    alert(
                        "К сожалению, последнее место уже занял другой администратор."
                    );

                }

                else {

                    alert(
                        "Не удалось изменить график. Проверьте подключение к интернету."
                    );
                }

                this.disabled = false;

                this.textContent =
                    oldText;
            }

        }
    );

});

// ======================================================
// ИЗМЕНЕНИЕ ВЫБРАННОГО АДМИНИСТРАТОРА
//
// Нужно перерисовать кнопки,
// чтобы вместо "Выбрать" показывалось "Снять"
// ======================================================

administrator.addEventListener(
    "change",
    function () {

        renderSchedule();

    }
);

// ======================================================
// ИЗМЕНЕНИЕ ДАТЫ
// ======================================================

dateInput.addEventListener(
    "change",
    function () {

        selectedIntervals = {};

        renderSchedule();

        subscribeToSchedule();

    }
);

// ======================================================
// СБРОС ГРАФИКА
// ======================================================

resetButton.addEventListener(
    "click",

    async function () {

        const password =
            prompt(
                "Введите пароль для сброса графика:"
            );

        if (password === null) {
            return;
        }

        if (
            password !== RESET_PASSWORD
        ) {

            alert(
                "Неверный пароль."
            );

            return;
        }

        const formattedDate =
            new Date(
                dateInput.value +
                "T00:00:00"
            ).toLocaleDateString(
                "ru-RU"
            );

        const confirmReset =
            confirm(
                `Вы действительно хотите полностью сбросить график на ${formattedDate}?`
            );

        if (!confirmReset) {
            return;
        }

        try {

            resetButton.disabled = true;

            resetButton.textContent =
                "Сброс...";

            await deleteDoc(
                getScheduleReference()
            );

            alert(
                `График на ${formattedDate} успешно сброшен.`
            );

        }

        catch (error) {

            console.error(error);

            alert(
                "Не удалось сбросить график."
            );

        }

        finally {

            resetButton.disabled = false;

            resetButton.textContent =
                "Сбросить график";
        }

    }
);

// ======================================================
// ЗАПУСК
// ======================================================

updateDateText();

renderSchedule();

subscribeToSchedule();