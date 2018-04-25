import {
    app,
    ipcMain,
} from 'electron';

import { WindowMain } from 'jslib/electron/window.main';

const SyncInterval = 5 * 60 * 1000; // 5 minutes

export class MessagingMain {
    private syncTimeout: NodeJS.Timer;

    constructor(private windowMain: WindowMain) { }

    init() {
        this.scheduleNextSync();
        ipcMain.on('messagingService', async (event: any, message: any) => this.onMessage(message));
    }

    onMessage(message: any) {
        switch (message.command) {
            case 'scheduleNextSync':
                this.scheduleNextSync();
                break;
            case 'updateAppMenu':
                // this.main.menuMain.updateApplicationMenuState(message.isAuthenticated, message.isLocked);
                break;
            default:
                break;
        }
    }

    private scheduleNextSync() {
        if (this.syncTimeout) {
            global.clearTimeout(this.syncTimeout);
        }

        this.syncTimeout = global.setTimeout(() => {
            if (this.windowMain.win == null) {
                return;
            }

            this.windowMain.win.webContents.send('messagingService', {
                command: 'checkSyncVault',
            });
        }, SyncInterval);
    }
}
