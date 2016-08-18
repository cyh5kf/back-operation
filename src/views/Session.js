import React from 'react'

var currentPath = '';

export class Session {
    static getLogined() {
        return localStorage.logined === "true";
    }

    static setLogined(logined) {
        localStorage.logined = logined;
    }

    static setUser(user) {
        localStorage.user = user;
    }

    static getUser() {
        return localStorage.user;
    }

    static getStatus() {
        return localStorage.onlinestatus;
    }

    static setStatus(status) {
        localStorage.onlinestatus = status;
    }

    static getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    /**
     *  设置当前请求url的地址,用于login登录成功后,跳转用
     */
    static setCurrentPath(path) {
        currentPath = path;
    }
    static getCurrentPath() {
        return currentPath;
    }
}

export default Session;
