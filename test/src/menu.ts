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
  Menu, MenuItem, MenuItemType
} from '../../lib/index';


class LogMenu extends Menu {

  events: string[] = [];

  methods: string[] = [];

  constructor(items?: MenuItem[]) {
    super();
    if (items) this.items = items;
  }

  handleEvent(event: Event): void {
    super.handleEvent(event);
    this.events.push(event.type);
  }

  protected isSelectable(item: MenuItem): boolean {
    this.methods.push('isSelectable');
    return super.isSelectable(item);
  }

  protected onItemsChanged(old: MenuItem[], items: MenuItem[]): void {
    super.onItemsChanged(old, items);
    this.methods.push('onItemsChanged');
  }

  protected onActiveIndexChanged(old: number, index: number): void {
    super.onActiveIndexChanged(old, index);
    this.methods.push('onActiveIndexChanged');
  }

  protected onAfterAttach(msg: Message): void {
    super.onAfterAttach(msg);
    this.methods.push('onAfterAttach');
  }

  protected onBeforeDetach(msg: Message): void {
    super.onBeforeDetach(msg);
    this.methods.push('onBeforeDetach');
  }

  protected onUpdateRequest(msg: Message): void {
    super.onUpdateRequest(msg);
    this.methods.push('onUpdateRequest');
  }

  protected onCloseRequest(msg: Message): void {
    super.onCloseRequest(msg);
    this.methods.push('onCloseRequest');
  }
}


function createMenu(): LogMenu {
  return new LogMenu([
    new MenuItem({
      text: '&Copy',
      shortcut: 'Ctrl+C',
      handler: () => { }
    }),
    new MenuItem({
      text: 'Cu&t',
      shortcut: 'Ctrl+X',
      handler: () => { }
    }),
    new MenuItem({
      text: '&Paste',
      shortcut: 'Ctrl+V',
      handler: () => { }
    }),
    new MenuItem({
      type: MenuItem.Separator
    }),
    new MenuItem({
      text: '&New Tab',
      handler: () => { }
    }),
    new MenuItem({
      text: '&Close Tab',
      handler: () => { }
    }),
    new MenuItem({
      type: MenuItem.Check,
      text: '&Save On Exit',
      handler: () => { }
    }),
    new MenuItem({
      type: MenuItem.Separator
    }),
    new MenuItem({
      text: 'Task Manager'
    }),
    new MenuItem({
      type: MenuItem.Separator
    }),
    new MenuItem({
      text: 'More...',
      submenu: new LogMenu([
        new MenuItem({
          text: 'One',
          handler: () => { }
        }),
        new MenuItem({
          text: 'Two',
          handler: () => { }
        }),
        new MenuItem({
          text: 'Three',
          handler: () => { }
        }),
        new MenuItem({
          text: 'Four',
          handler: () => { }
        })
      ])
    }),
    new MenuItem({
      type: MenuItem.Separator
    }),
    new MenuItem({
      text: 'Close',
      handler: () => { }
    })
  ]);
}


function triggerMouseEvent(node: HTMLElement, eventType: string, options: any = {}): MouseEvent {
  let event = document.createEvent('MouseEvent');
  event.initMouseEvent(
    eventType, true, true, window, 0, 0, 0,
    options.clientX || 0, options.clientY || 0,
    options.ctrlKey || false, options.altKey || false,
    options.shiftKey || false, options.metaKey || false,
    options.button || 0, options.relatedTarget || null
  );
  node.dispatchEvent(event);
  return event;
}


function triggerKeyEvent(node: HTMLElement, eventType: string, options: any = {}): Event {
  // cannot use KeyboardEvent in Chrome because it sets keyCode = 0
  let event = document.createEvent('Event');
  event.initEvent(eventType, true, true);
  for (let prop in options) {
    (<any>event)[prop] = options[prop];
  }
  node.dispatchEvent(event);
  return event;
}


describe('phosphor-menus', () => {

  describe('Menu', () => {

    describe('#constructor()', () => {

      it('should accept no arguments', () => {
        let menu = new Menu();
        expect(menu instanceof Menu).to.be(true);
      });

      it('should add the `p-Menu` class', () => {
        let menu = new Menu();
        expect(menu.hasClass('p-Menu')).to.be(true);
      });

    });

    describe('#dispose()', () => {

      it('should dispose of the resources held by the menu', () => {
        let menu = createMenu();
        menu.dispose();
        expect(menu.parent).to.be(null);
      });

    });

    describe('#closed', () => {

      it('should be emitted when the menu is closed', () => {
        let menu = createMenu();
        let called = false;
        menu.closed.connect(() => { called = true; });
        menu.popup(0, 0);
        menu.close();
        expect(called).to.be(true);
        menu.dispose();
      });

    });

    describe('#parentMenu', () => {

      it('should get the parent menu of the menu', () => {
        let menu = createMenu();
        menu.popup(0, 0);
        menu.activeIndex = 10;
        menu.openActiveItem();
        expect(menu.items[10].submenu.parentMenu).to.be(menu);
        menu.dispose();
      });

      it('should be null if the menu is not an open submenu', () => {
        let menu = createMenu();
        expect(menu.items[10].submenu.parentMenu).to.be(null);
      });

    });

    describe('#childMenu', () => {

      it('should get the child menu of the menu', () => {
        let menu = createMenu();
        menu.popup(0, 0);
        menu.activeIndex = 10;
        menu.openActiveItem();
        expect(menu.childMenu).to.be(menu.items[10].submenu);
        menu.dispose();
      });

      it('should null if the menu does not have an open submenu', () => {
        let menu = createMenu();
        expect(menu.childMenu).to.be(null);
      });

    });

    describe('#rootMenu', () => {

      it('should find the root menu of this menu hierarchy', () => {
        let menu = createMenu();
        menu.popup(0, 0);
        expect(menu.rootMenu).to.be(menu);
        menu.activeIndex = 10;
        menu.openActiveItem();
        expect(menu.items[10].submenu.rootMenu).to.be(menu);
        menu.dispose();
      });

    });

    describe('#leafMenu', () => {

      it('should find the root menu of this menu hierarchy', () => {
        let menu = createMenu();
        menu.popup(0, 0);
        expect(menu.leafMenu).to.be(menu);
        menu.activeIndex = 10;
        menu.openActiveItem();
        expect(menu.leafMenu).to.be(menu.items[10].submenu);
        menu.dispose();
      });

    });

    describe('#contentNode', () => {

      it('should get the menu content node', () => {
        let menu = createMenu();
        expect(menu.contentNode.classList.contains('p-Menu-content')).to.be(true);
      });

    });

    describe('#openActiveItem()', () => {

      it('should open the submenu of the active item, if possible', () => {
        let submenu = createMenu();
        let menu = new Menu([new MenuItem({ submenu })]);
        menu.attach(document.body);
        menu.activeIndex = 0;
        menu.openActiveItem();
        expect(submenu.activeIndex).to.be(0);
        menu.dispose();
      });

      it('should bail if the menu is not visible', () => {
        let submenu = createMenu();
        let menu = new Menu([new MenuItem({ submenu })]);
        menu.activeIndex = 0;
        menu.openActiveItem();
        expect(submenu.activeIndex).to.be(-1);
      });

      it('should bail if nothing is active', () => {
        let submenu = createMenu();
        let menu = new Menu([new MenuItem({ submenu })]);
        menu.attach(document.body);
        menu.openActiveItem();
        expect(submenu.activeIndex).to.be(-1);
        menu.dispose();
      });

      it('should bail if there is no submenu', () => {
        let handler = () => {};
        let menu = new Menu([new MenuItem({ handler })]);
        menu.attach(document.body);
        menu.activeIndex = 0;
        menu.openActiveItem();
        expect(menu.childMenu).to.be(null);
        menu.dispose();
      });

    });

    describe('#triggerActiveItem', () => {

      it('should trigger a submenu', () => {
        let submenu = createMenu();
        let menu = new Menu([new MenuItem({ submenu })]);
        menu.attach(document.body);
        menu.activeIndex = 0;
        menu.triggerActiveItem();
        expect(submenu.activeIndex).to.be(0);
        menu.dispose();
      });

      it('should trigger the handler of the active item, if possible', () => {
        let called = false;
        let handler = () => { called = true; };
        let menu = new Menu([new MenuItem({ handler })]);
        menu.attach(document.body);
        menu.activeIndex = 0;
        menu.triggerActiveItem();
        expect(called).to.be(true);
        menu.dispose();
      });

      it('should bail if the menu is not visible', () => {
        let called = false;
        let handler = () => { called = true; };
        let menu = new Menu([new MenuItem({ handler })]);
        menu.activeIndex = 0;
        menu.triggerActiveItem();
        expect(called).to.be(false);
      });

      it('should bail if there is no active item', () => {
        let called = false;
        let handler = () => { called = true; };
        let menu = new Menu([new MenuItem({ handler })]);
        menu.attach(document.body);
        menu.triggerActiveItem();
        expect(called).to.be(false);
        menu.dispose();
      });

      it('should bail if the active item cannot be triggered', () => {
        let called = false;
        let handler = () => { called = true; };
        let disabled = true;
        let menu = new Menu([new MenuItem({ handler, disabled })]);
        menu.attach(document.body);
        menu.activeIndex = 0;
        menu.triggerActiveItem();
        expect(called).to.be(false);
        menu.dispose();
      });

    });

    describe('#popup()', () => {

      it('should popup the menu at the specified location', () => {
        let menu = createMenu();
        menu.popup(10, 10);
        let rect = menu.node.getBoundingClientRect();
        expect(rect.left).to.be(10);
        expect(rect.top).to.be(10);
        menu.dispose();
      });

      it('should be adjusted to fit naturally on the screen', () => {
        let menu = createMenu();
        menu.popup(-1000, -1000);
        let rect = menu.node.getBoundingClientRect();
        expect(rect.left).to.be(0);
        expect(rect.top).to.be(0);
        menu.dispose();
      });

      it('should accept flags to force the location', () => {
        let menu = createMenu();
        menu.popup(10000, 10000, true, true);
        let rect = menu.node.getBoundingClientRect();
        expect(rect.left).to.be(10000);
        expect(rect.top).to.be(10000);
        menu.dispose();
      });

      it('should accept mouse and key presses', () => {
        let menu = createMenu();
        menu.popup(0, 0);
        triggerKeyEvent(document.body, 'keydown');
        triggerKeyEvent(document.body, 'keypress');
        triggerMouseEvent(document.body, 'mousedown');
        expect(menu.events.indexOf('keydown')).to.not.be(-1);
        expect(menu.events.indexOf('keypress')).to.not.be(-1);
        expect(menu.events.indexOf('mousedown')).to.not.be(-1);
        menu.dispose();
      });

    });

    describe('#open()', () => {

      it('should open the menu at the specified location', () => {
        let menu = createMenu();
        menu.open(10, 10);
        let rect = menu.node.getBoundingClientRect();
        expect(rect.left).to.be(10);
        expect(rect.top).to.be(10);
        menu.dispose();
      });

      it('should be adjusted to fit naturally on the screen', () => {
        let menu = createMenu();
        menu.open(-1000, -1000);
        let rect = menu.node.getBoundingClientRect();
        expect(rect.left).to.be(0);
        expect(rect.top).to.be(0);
        menu.dispose();
      });

      it('should accept flags to force the location', () => {
        let menu = createMenu();
        menu.open(10000, 10000, true, true);
        let rect = menu.node.getBoundingClientRect();
        expect(rect.left).to.be(10000);
        expect(rect.top).to.be(10000);
        menu.dispose();
      });

      it('should ignore mouse and key presses', () => {
        let menu = createMenu();
        menu.open(0, 0);
        triggerKeyEvent(document.body, 'keydown');
        triggerKeyEvent(document.body, 'keypress');
        triggerMouseEvent(document.body, 'mousedown');
        expect(menu.events.indexOf('keydown')).to.be(-1);
        expect(menu.events.indexOf('keypress')).to.be(-1);
        expect(menu.events.indexOf('mousedown')).to.be(-1);
        menu.dispose();
      });

    });

    describe('#isSelectable()', () => {

      it('should be invoked to test whether an item is selectable', () => {
        let menu = createMenu();
        menu.activeIndex = 0;
        expect(menu.methods.indexOf('isSelectable')).to.not.be(-1);
      });

    });

    describe('#onItemsChanged()', () => {

      it('should be invoked when the menu items change', () => {
        let menu = createMenu();
        menu.items = [];
        expect(menu.methods.indexOf('onItemsChanged')).to.not.be(-1);
      });

      it('should close the menu', () => {
        let menu = createMenu();
        menu.popup(0, 0);
        expect(menu.isAttached).to.be(true);
        menu.items = [];
        expect(menu.isAttached).to.be(false);
        menu.dispose();
      });

    });

    describe('#onActiveIndexChanged()', () => {

      it('should be invoked when the active index changes', () => {
        let menu = createMenu();
        menu.activeIndex = 0;
        expect(menu.methods.indexOf('onActiveIndexChanged')).to.not.be(-1);
      });

    });

    describe('#onTriggerItem()', () => {

      it('should close the root menu', () => {
        let menu = createMenu();
        menu.popup(0, 0);
        menu.activeIndex = 10;
        menu.openActiveItem();
        menu.childMenu.triggerActiveItem();
        expect(menu.isAttached).to.be(false);
        menu.dispose();
      });

      it('should invoke the item handler', () => {
        let called = false;
        let handler = () => { called = true; };
        let menu = new Menu([new MenuItem({ handler })]);
        menu.popup(0, 0);
        menu.activateNextItem();
        menu.triggerActiveItem();
        expect(called).to.be(true);
        menu.dispose();
      });

    });

    describe('#onUpdateRequest()', () => {

      it('should be invoked on `open`', () => {
        let menu = createMenu();
        menu.open(0, 0);
        expect(menu.methods.indexOf('onUpdateRequest')).to.not.be(-1);
        menu.dispose();
      });

      it('should be invoked on `popup`', () => {
        let menu = createMenu();
        menu.popup(0, 0);
        expect(menu.methods.indexOf('onUpdateRequest')).to.not.be(-1);
        menu.dispose();
      });

      it('should attach the menu to the DOM', (done) => {
        let menu = createMenu();
        menu.popup(0, 0);
        requestAnimationFrame(() => {
          expect(menu.isVisible).to.be(true);
          menu.dispose();
          done();
        });
      });

    });

    describe('#onCloseRequest()', () => {

      it('should be invoked when a menu is closed', () => {
        let menu = createMenu();
        menu.popup(0, 0);
        menu.close();
        expect(menu.methods.indexOf('onCloseRequest')).to.not.be(-1);
        menu.dispose();
      });

      it('should detach the widget from the DOM', () => {
        let menu = new Menu();
        menu.popup(0, 0);
        expect(menu.isAttached).to.be(true);
        menu.close();
        expect(menu.isAttached).to.be(false);
        menu.dispose();
      });

    });

    context('key handling', () => {

      it('should trigger the active item on `Enter`', () => {
        let menu = createMenu();
        let called = false;
        menu.items[0].handler = () => { called = true; };
        menu.popup(0, 0);
        menu.activateNextItem();
        triggerKeyEvent(document.body, 'keydown', { keyCode: 13 });
        expect(called).to.be(true);
        menu.dispose();
      });

      it('should close the leaf menu on `Escape`', () => {
        let menu = createMenu();
        menu.popup(0, 0);
        menu.activeIndex = 10;
        menu.openActiveItem();
        expect(menu.childMenu).to.be(menu.items[10].submenu);
        triggerKeyEvent(document.body, 'keydown', { keyCode: 27 });
        expect(menu.childMenu).to.be(null);
        menu.dispose();
      });

      it('should close the leaf menu on `ArrowLeft` unless root', () => {
        let menu = createMenu();
        menu.popup(0, 0);
        menu.activeIndex = 10;
        menu.openActiveItem();
        expect(menu.childMenu).to.be(menu.items[10].submenu);
        triggerKeyEvent(document.body, 'keydown', { keyCode: 37 });
        expect(menu.childMenu).to.be(null);
        triggerKeyEvent(document.body, 'keydown', { keyCode: 37 });
        expect(menu.isAttached).to.be(true);
        menu.dispose();
      });

      it('should activate the previous item on `ArrowUp`', () => {
        let menu = createMenu();
        menu.popup(0, 0);
        menu.activeIndex = 1;
        triggerKeyEvent(document.body, 'keydown', { keyCode: 38 });
        expect(menu.activeIndex).to.be(0);
        menu.dispose();
      });

      it('should open the active item on `ArrowRight`', () => {
        let menu = createMenu();
        menu.popup(0, 0);
        menu.activeIndex = 10;
        expect(menu.childMenu).to.be(null);
        triggerKeyEvent(document.body, 'keydown', { keyCode: 39 });
        expect(menu.childMenu).to.be(menu.items[10].submenu);
        menu.dispose();
      });

      it('should activate the next item on `ArrowDown`', () => {
        let menu = createMenu();
        menu.popup(0, 0);
        menu.activateNextItem();
        expect(menu.activeIndex).to.be(0);
        triggerKeyEvent(document.body, 'keydown', { keyCode: 40 });
        expect(menu.activeIndex).to.be(1);
        menu.dispose();
      });

      it('should activate an item based on a mnemonic', () => {
        let menu = createMenu();
        menu.popup(0, 0);
        expect(menu.activeIndex).to.be(-1);
        triggerKeyEvent(document.body, 'keypress', { charCode: 84 } );  // 't' key
        expect(menu.activeIndex).to.be(1);
        menu.dispose();
      });

    });

    context('mouse handling', () => {

      it('should close the child menu on mouse over of different item', (done) => {
        let menu = createMenu();
        menu.popup(0, 0);
        menu.activeIndex = 10;
        menu.openActiveItem();
        let node = menu.contentNode.firstChild as HTMLElement;
        triggerMouseEvent(node, 'mousemove');
        setTimeout(() => {
          expect(menu.childMenu).to.be(null);
          menu.dispose();
          done();
        }, 500);
      });

      it('should cancel the close on mouse enter of same item', (done) => {
        let menu = createMenu();
        menu.popup(0, 0);
        menu.activeIndex = 10;
        menu.openActiveItem();
        let node = menu.contentNode.firstChild as HTMLElement;
        let rect = node.getBoundingClientRect();
        let args = { clientX: rect.left + 1, clientY: rect.top + 1 };
        triggerMouseEvent(node, 'mousemove', args);
        node = menu.contentNode.childNodes[10] as HTMLElement;
        rect = node.getBoundingClientRect();
        args = { clientX: rect.left + 1, clientY: rect.top + 1 };
        triggerMouseEvent(node, 'mousemove', args);
        setTimeout(() => {
          expect(menu.childMenu).to.not.be(null);
          menu.dispose();
          done();
        }, 500);
      });

      it('should trigger the item on mouse over and mouse up', () => {
        let menu = createMenu();
        menu.popup(0, 0);
        menu.activeIndex = 10;
        menu.openActiveItem();
        let called = false;
        menu.childMenu.items[0].handler = () => { called = true; };
        let node = menu.childMenu.contentNode.childNodes[0] as HTMLElement;
        let rect = node.getBoundingClientRect();
        let args = { clientX: rect.left + 1, clientY: rect.top + 1 };
        triggerMouseEvent(node, 'mousemove', args);
        triggerMouseEvent(node, 'mousedown', args);
        triggerMouseEvent(node, 'mouseup', args);
        expect(called).to.be(true);
        menu.dispose();
      });

      it('should suppress context menu events', () => {
        let menu = createMenu();
        menu.attach(document.body);
        let event = triggerMouseEvent(menu.node, 'contextmenu');
        expect(event.defaultPrevented).to.be(true);
        menu.dispose();
      });

    });

    it('should close the child menu on mouse leave', (done) => {
      let menu = createMenu();
      menu.popup(0, 0);
      menu.activeIndex = 10;
      menu.openActiveItem();
      triggerMouseEvent(menu.node, 'mouseleave');
      setTimeout(() => {
        expect(menu.childMenu).to.be(null);
        menu.dispose();
        done();
      }, 500);
    });

  });

});
