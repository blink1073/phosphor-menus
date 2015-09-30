/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import expect = require('expect.js');

import {
  Message
} from 'phosphor-messaging';

import {
  Signal
} from 'phosphor-signaling';

import {
  attachWidget, Widget
} from 'phosphor-widget';

import {
  ACTIVE_CLASS, CHECK_TYPE_CLASS, CHECKED_CLASS, CONTENT_CLASS, 
  DISABLED_CLASS, FORCE_HIDDEN_CLASS, HAS_SUBMENU_CLASS,  HIDDEN_CLASS, 
  ICON_CLASS, MENU_CLASS, MENU_ITEM_CLASS, SEPARATOR_TYPE_CLASS, 
  SHORTCUT_CLASS, SUBMENU_ICON_CLASS, TEXT_CLASS, IMenuItemTemplate, 
  Menu, MenuItem
} from '../../lib/index';

import './index.css';


function logItem(item: MenuItem): void {
  console.log(item.text);
}


var MENU_TEMPLATE = [
  {
    text: 'File',
    submenu: [
      {
        text: 'New File',
        shortcut: 'Ctrl+N',
        handler: logItem
      },
      {
        text: 'Open File',
        shortcut: 'Ctrl+O',
        handler: logItem
      },
      {
        text: 'Save File',
        shortcut: 'Ctrl+S',
        handler: logItem
      },
      {
        text: 'Save As...',
        shortcut: 'Ctrl+Shift+S',
        handler: logItem
      },
      {
        type: 'separator'
      },
      {
        text: 'Close File',
        shortcut: 'Ctrl+W',
        handler: logItem
      },
      {
        text: 'Close All Files',
        handler: logItem
      },
      {
        type: 'separator'
      },
      {
        text: 'More...',
        submenu: [
          {
            text: 'One',
            handler: logItem
          },
          {
            text: 'Two',
            handler: logItem
          },
          {
            text: 'Three',
            handler: logItem
          },
          {
            text: 'Four',
            handler: logItem
          }
        ]
      },
      {
        type: 'separator'
      },
      {
        text: 'Exit',
        handler: logItem
      }
    ]
  },
  {
    text: 'Edit',
    submenu: [
      {
        text: '&Undo',
        shortcut: 'Ctrl+Z',
        className: 'undo',
        handler: logItem
      },
      {
        text: '&Repeat',
        shortcut: 'Ctrl+Y',
        className: 'repeat',
        handler: logItem
      },
      {
        type: 'separator'
      },
      {
        text: '&Copy',
        shortcut: 'Ctrl+C',
        className: 'copy',
        handler: logItem
      },
      {
        text: 'Cu&t',
        shortcut: 'Ctrl+X',
        className: 'cut',
        handler: logItem
      },
      {
        text: '&Paste',
        shortcut: 'Ctrl+V',
        className: 'paste',
        handler: logItem
      }
    ]
  },
  {
    text: 'Find',
    submenu: [
      {
        text: 'Find...',
        shortcut: 'Ctrl+F',
        handler: logItem
      },
      {
        text: 'Find Next',
        shortcut: 'F3',
        handler: logItem
      },
      {
        text: 'Find Previous',
        shortcut: 'Shift+F3',
        handler: logItem
      },
      {
        type: 'separator'
      },
      {
        text: 'Replace...',
        shortcut: 'Ctrl+H',
        handler: logItem
      },
      {
        text: 'Replace Next',
        shortcut: 'Ctrl+Shift+H',
        handler: logItem
      }
    ]
  },
  {
    text: 'View',
    disabled: true
  },
  {
    type: 'separator'
  },
  {
    text: 'Help',
    submenu: [
      {
        text: 'Documentation',
        handler: logItem
      },
      {
        text: 'About',
        handler: logItem
      }
    ]
  }
];


describe('phosphor-menu', () => {

  describe('MENU_CLASS', () => {

    it('should equal `p-Menu`', () => {
      expect(MENU_CLASS).to.be('p-Menu');
    });

  });

  describe('CONTENT_CLASS', () => {

    it('should equal `p-Menu-content`', () => {
      expect(CONTENT_CLASS).to.be('p-Menu-content');
    });

  });

  describe('MENU_ITEM_CLASS', () => {

    it('should equal `p-Menu-item`', () => {
      expect(MENU_ITEM_CLASS).to.be('p-Menu-item');
    });

  });

  describe('ICON_CLASS', () => {

    it('should equal `p-Menu-item-icon`', () => {
      expect(ICON_CLASS).to.be('p-Menu-item-icon');
    });

  });

  describe('TEXT_CLASS', () => {

    it('should equal `p-Menu-item-text`', () => {
      expect(TEXT_CLASS).to.be('p-Menu-item-text');
    });

  });

  describe('SHORTCUT_CLASS', () => {

    it('should equal `p-Menu-item-shortcut`', () => {
      expect(SHORTCUT_CLASS).to.be('p-Menu-item-shortcut');
    });

  });

  describe('SUBMENU_ICON_CLASS', () => {

    it('should equal `p-Menu-item-submenu-icon`', () => {
      expect(SUBMENU_ICON_CLASS).to.be('p-Menu-item-submenu-icon');
    });

  });

  describe('CHECK_TYPE_CLASS', () => {

    it('should equal `p-mod-check-type`', () => {
      expect(CHECK_TYPE_CLASS).to.be('p-mod-check-type');
    });

  });

  describe('SEPARATOR_TYPE_CLASS', () => {

    it('should equal `p-mod-separator-type`', () => {
      expect(SEPARATOR_TYPE_CLASS).to.be('p-mod-separator-type');
    });

  });

  describe('ACTIVE_CLASS', () => {

    it('should equal `p-mod-active`', () => {
      expect(ACTIVE_CLASS).to.be('p-mod-active');
    });

  });

  describe('DISABLED_CLASS', () => {

    it('should equal `p-mod-disabled`', () => {
      expect(DISABLED_CLASS).to.be('p-mod-disabled');
    });

  });

  describe('HIDDEN_CLASS', () => {

    it('should equal `p-mod-hidden`', () => {
      expect(HIDDEN_CLASS).to.be('p-mod-hidden');
    });

  });

  describe('FORCE_HIDDEN_CLASS', () => {

    it('should equal `p-mod-force-hidden`', () => {
      expect(FORCE_HIDDEN_CLASS).to.be('p-mod-force-hidden');
    });

  });

  describe('CHECKED_CLASS', () => {

    it('should equal `p-mod-checked`', () => {
      expect(CHECKED_CLASS).to.be('p-mod-checked');
    });

  });

  describe('HAS_SUBMENU_CLASS', () => {

    it('should equal `p-mod-has-submenu`', () => {
      expect(HAS_SUBMENU_CLASS).to.be('p-mod-has-submenu');
    });

  });

  describe('Menu', () => {

    describe('.fromTemplate', () => {

      it('should create a menu from a template', () => {
        var menu = Menu.fromTemplate(MENU_TEMPLATE);
        expect(menu.items.length).to.be(6);
      });

    });

    describe('.closedSignal', () => {

      it('should be a signal', () => {
        expect(Menu.closedSignal instanceof Signal).to.be(true);
      });

    });

    describe('#constructor()', () => {

      it('should accept no arguments', () => {
        var menu = new Menu();
        expect(menu instanceof Menu).to.be(true);
      });

      it('should add MENU_CLASS', () => {
        var menu = new Menu();
        expect(menu.hasClass(MENU_CLASS)).to.be(true);
      });

    });

    describe('#dispose()', () => {

      it('should dispose of the resources held by the menu', () => {
        var menu = Menu.fromTemplate(MENU_TEMPLATE);
        menu.dispose();
        expect(menu.items.length).to.be(0);
      });

    });

    describe('#closed', () => {

      it('should emitted when the menu item is closed', () => {
        var menu = Menu.fromTemplate(MENU_TEMPLATE);
        var main = new Widget();
        main.children = [menu];
        var called = false;
        menu.closed.connect(() => { called = true; });
        menu.close(true);
        expect(called).to.be(true);
      });

    });

    describe('#parentMenu', () => {

      it('should get the parent menu of the menu', () => {
        var menu = Menu.fromTemplate(MENU_TEMPLATE);
        menu.open(1, 1);
        menu.activeIndex = 0;
        menu.openActiveItem();
        expect(menu.items[0].submenu.parentMenu).to.eql(menu);
      });

      it('should null if the menu is not an open submenu', () => {
        var menu = Menu.fromTemplate(MENU_TEMPLATE);
        expect(menu.items[0].submenu.parentMenu).to.be(null);
      });

    });

    describe('#childMenu', () => {

      it('should get the child menu of the menu', () => {
        var menu = Menu.fromTemplate(MENU_TEMPLATE);
        menu.open(1, 1);
        menu.activeIndex = 0;
        menu.openActiveItem();
        expect(menu.childMenu).to.eql(menu.items[0].submenu);
      });

      it('should null if the menu does not have an open submenu', () => {
        var menu = Menu.fromTemplate(MENU_TEMPLATE);
        expect(menu.childMenu).to.be(null);
      });

    });

    describe('#rootMenu', () => {

      it('should find the root menu of this menu hierarchy', () => {
        var menu = Menu.fromTemplate(MENU_TEMPLATE);
        expect(menu.rootMenu).to.eql(menu);
        for (var i = 0; i < menu.items.length; i++) {
          var submenu = menu.items[i].submenu;
          if (submenu === null) {
            continue;
          }
          menu.activeIndex = i;
          menu.openActiveItem();
          expect(submenu.rootMenu).to.eql(menu);
          for (var j = 0; j < submenu.items.length; j++) {
            var subSubmenu = submenu.items[j].submenu;
            if (subSubmenu !== null) {
              submenu.activeIndex = j;
              submenu.openActiveItem();
              expect(subSubmenu.rootMenu).to.eql(menu);
              subSubmenu.close();
            }
          }
          submenu.close();
        }
      });

    });

    describe('#leafMenu', () => {

      it('should find the root menu of this menu hierarchy', () => {
        var menu = Menu.fromTemplate(MENU_TEMPLATE);
        expect(menu.rootMenu).to.eql(menu);
        for (var i = 0; i < menu.items.length; i++) {
          var submenu = menu.items[i].submenu;
          if (submenu === null) {
            continue;
          }
          menu.activeIndex = i;
          menu.openActiveItem();
          expect(menu.leafMenu).to.eql(submenu);
          for (var j = 0; j < submenu.items.length; j++) {
            var subSubmenu = submenu.items[j].submenu;
            if (subSubmenu !== null) {
              submenu.activeIndex = j;
              submenu.openActiveItem();
              expect(submenu.leafMenu).to.eql(subSubmenu);
              expect(menu.leafMenu).to.eql(subSubmenu);
              subSubmenu.close();
            }
          }
          submenu.close();
        }
      });

    });

  });

});
