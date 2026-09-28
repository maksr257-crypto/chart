/* =========================
   ADAPTIVE — TABLET
========================= */

max-width: 800px {

    .header {
        height: auto;
        min-height: 64px;
        padding: 10px 16px;
    }

    .header-info {
        display: none;
    }

    .logo-icon {
        width: 36px;
        height: 36px;
    }

    .logo-text strong {
        font-size: 14px;
    }

    .logo-text span {
        font-size: 11px;
    }

    .container {
        width: calc(100% - 24px);
        margin: 16px auto 30px;
    }

    /* Верх */

    .top-panel {
        flex-direction: column;
        align-items: stretch;

        gap: 20px;

        padding: 20px;

        border-radius: 12px;
    }

    .page-title h1 {
        font-size: 22px;
        line-height: 1.2;
    }

    .page-title p {
        font-size: 13px;
        line-height: 1.5;
    }

    .date-selector {
        width: 100%;
        min-width: 0;
    }

    .date-selector input {
        width: 100%;
        height: 46px;

        font-size: 16px;
    }

    /* Администратор */

    .admin-panel {
        padding: 20px;

        border-radius: 12px;
    }

    #administrator {
        width: 100%;
        height: 46px;

        font-size: 16px;
    }

    /* График */

    .schedule-panel {
        border-radius: 12px;
    }

    .schedule-header {
        padding: 18px 20px;

        flex-direction: column;
        align-items: flex-start;

        gap: 12px;
    }

    .selected-counter {
        width: 100%;

        text-align: center;
    }

    /* Интервал */

    .time-block {
        grid-template-columns: 1fr;

        gap: 14px;

        padding: 18px 20px;
    }

    .time {
        justify-content: flex-start;
    }

    .time strong {
        font-size: 18px;
    }

    .interval-header {
        align-items: center;
    }

    .admins {
        gap: 6px;
    }

    .admin,
    .free {
        font-size: 12px;

        word-break: break-word;
    }

    /* Большая кнопка для пальца */

    .select-button {
        width: 100%;
        height: 46px;

        font-size: 14px;
    }

    /* Низ */

    .schedule-footer {
        padding: 18px 20px;

        flex-direction: column;

        gap: 10px;
    }

    .reset-button,
    .save-button,
    .sync-status {
        width: 100%;
        min-width: 0;

        height: 46px;
    }

    .info-panel {
        padding: 16px;
    }

    footer {
        width: calc(100% - 24px);

        flex-direction: column;

        gap: 6px;

        text-align: center;
    }
}

/* =========================
   ADAPTIVE — PHONE
========================= */

max-width: 480px {

    body {
        overflow-x: hidden;
    }

    .header {
        padding: 10px 12px;
    }

    .logo {
        gap: 9px;
    }

    .logo-icon {
        width: 34px;
        height: 34px;

        border-radius: 8px;
    }

    .logo-text strong {
        font-size: 13px;
    }

    .logo-text span {
        font-size: 10px;
    }

    .container {
        width: calc(100% - 16px);

        margin-top: 10px;
    }

    /* Верхняя карточка */

    .top-panel {
        padding: 17px;

        margin-bottom: 10px;

        border-radius: 10px;
    }

    .page-title h1 {
        font-size: 20px;

        margin-bottom: 7px;
    }

    .page-title p {
        font-size: 12px;
    }

    /* Админ */

    .admin-panel {
        padding: 17px;

        margin-bottom: 10px;

        border-radius: 10px;
    }

    .section-title {
        margin-bottom: 13px;
    }

    .section-title h2 {
        font-size: 17px;
    }

    .section-title p {
        font-size: 12px;

        line-height: 1.4;
    }

    /* Заголовок графика */

    .schedule-header {
        padding: 17px;


}

    .schedule-header h2 {
        font-size: 17px;
    }

    /* Каждый временной блок */

    .time-block {
        padding: 17px;

        gap: 12px;
    }

    .time {
        width: 100%;

        padding-bottom: 10px;

        border-bottom: 1px solid #f0f1f3;
    }

    .time strong {
        font-size: 18px;
    }

    .interval-header {
        width: 100%;

        gap: 8px;
    }

    .interval-name {
        font-size: 13px;
    }

    .capacity {
        flex-shrink: 0;
    }

    /* Ники */

    .admins {
        width: 100%;

        align-items: stretch;

        flex-direction: column;
    }

    .admin,
    .free {
        width: 100%;

        padding: 8px 10px;
    }

    /* Кнопка */

    .select-button {
        height: 48px;

        font-size: 14px;

        border-radius: 8px;
    }

    /* Footer графика */

    .schedule-footer {
        padding: 15px;
    }

    .reset-button,
    .save-button {
        height: 48px;

        font-size: 14px;
    }

    /* Информация */

    .info-panel {
        margin-top: 10px;

        padding: 14px;
    }

    .info-panel p {
        font-size: 11px;
    }

    footer {
        margin-bottom: 20px;

        font-size: 11px;
    }
}

/* =========================
   ОЧЕНЬ МАЛЕНЬКИЕ ЭКРАНЫ
========================= */

max-width: 350px {

    .logo-text span {
        display: none;
    }

    .page-title h1 {
        font-size: 18px;
    }

    .interval-header {
        flex-direction: column;

        align-items: flex-start;
    }

    .capacity {
        align-self: flex-start;
    }
}

В <head> у тебя уже правильно стоит:

<meta name="viewport" content="width=device-width, initial-scale=1.0">