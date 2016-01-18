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
  Message, sendMessage
} from 'phosphor-messaging';

import {
  Widget
} from 'phosphor-widget';

import {
  Menu, MenuBar, MenuItem
} from '../../lib/index';


class LogMenuBar extends MenuBar {

  methods: string[] = [];

  events: string[] = [];

  constructor(items?: MenuItem[]) {
    super();
    if (items) this.items = items;
  }

  handleEvent(event: Event): void {
    super.handleEvent(event);
    this.methods.push(event.type);
  }

  protected onItemsChanged(old: MenuItem[], items: MenuItem[]): void {
    super.onItemsChanged(old, items);
    this.methods.push('onItemsChanged');
  }

  protected onActiveIndexChanged(old: number, index: number): void {
    super.onActiveIndexChanged(old, index);
    this.methods.push('onActiveIndexChanged');
  }

  protected isSelectable(item: MenuItem): boolean {
    this.methods.push('isSelectable');
    return super.isSelectable(item);
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


function createMenuBar(): LogMenuBar {
  return new LogMenuBar([
    new MenuItem({
      text: 'File',
      submenu: new Menu([
        new MenuItem({
          text: 'New File',
          shortcut: 'Ctrl+N',
          handler: () => {}
        }),
        new MenuItem({
          text: 'Open File',
          type: MenuItem.Check,
          shortcut: 'Ctrl+O',
          handler: () => {}
        }),
        new MenuItem({
          text: '&Save File',
          shortcut: 'Ctrl+S',
          handler: () => {}
        }),
        new MenuItem({
          text: 'Save As...',
          shortcut: 'Ctrl+Shift+S',
          handler: () => {}
        }),
        new MenuItem({
          type: MenuItem.Separator
        }),
        new MenuItem({
          text: 'Close File',
          shortcut: 'Ctrl+W',
          handler: () => {}
        }),
        new MenuItem({
          text: 'Close All Files',
          handler: () => {}
        }),
        new MenuItem({
          type: MenuItem.Separator
        }),
        new MenuItem({
          text: 'More...',
          submenu: new Menu([
            new MenuItem({
              text: 'One',
              handler: () => {}
            }),
            new MenuItem({
              text: 'Two',
              handler: () => {}
            }),
            new MenuItem({
              text: 'Three',
              handler: () => {}
            }),
            new MenuItem({
              text: 'Four',
              handler: () => {}
            })
          ])
        }),
        new MenuItem({
          type: MenuItem.Separator
        }),
        new MenuItem({
          text: 'Exit',
          handler: () => {}
        })
      ])
    }),
    new MenuItem({
      text: 'Edit',
      submenu: new Menu([
        new MenuItem({
          text: '&Undo',
          shortcut: 'Ctrl+Z',
          className: 'undo',
          handler: () => {}
        }),
        new MenuItem({
          text: '&Repeat',
          shortcut: 'Ctrl+Y',
          className: 'repeat',
          handler: () => {}
        }),
        new MenuItem({
          type: MenuItem.Separator
        }),
        new MenuItem({
          text: '&Copy',
          shortcut: 'Ctrl+C',
          className: 'copy',
          handler: () => {}
        }),
        new MenuItem({
          text: 'Cu&t',
          shortcut: 'Ctrl+X',
          className: 'cut',
          handler: () => {}
        }),
        new MenuItem({
          text: '&Paste',
          shortcut: 'Ctrl+V',
          className: 'paste',
          handler: () => {}
        })
      ])
    }),
    new MenuItem({
      text: 'Find',
      submenu: new Menu([
        new MenuItem({
          text: 'Find...',
          shortcut: 'Ctrl+F',
          handler: () => {}
        }),
        new MenuItem({
          text: 'Find Next',
          shortcut: 'F3',
          handler: () => {}
        }),
        new MenuItem({
          text: 'Find Previous',
          shortcut: 'Shift+F3',
          handler: () => {}
        }),
        new MenuItem({
          type: MenuItem.Separator
        }),
        new MenuItem({
          text: 'Replace...',
          shortcut: 'Ctrl+H',
          handler: () => {}
        }),
        new MenuItem({
          text: 'Replace Next',
          shortcut: 'Ctrl+Shift+H',
          handler: () => {}
        })
      ])
    }),
    new MenuItem({
      type: MenuItem.Separator
    }),
    new MenuItem({
      text: 'Help',
      submenu: new Menu([
        new MenuItem({
          text: 'Documentation',
          handler: () => {}
        }),
        new MenuItem({
          text: 'About',
          handler: () => {}
        })
      ])
    }),
    new MenuItem({
      text: 'foo'
    }),
    new MenuItem({
      text: 'bar',
      disabled: true
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


function triggerKeyEvent(node: HTMLElement, eventType: string, options: any = {}) {
  // cannot use KeyboardEvent in Chrome because it sets keyCode = 0
  let event = document.createEvent('Event');
  event.initEvent(eventType, true, true);
  for (let prop in options) {
    (<any>event)[prop] = options[prop];
  }
  node.dispatchEvent(event);
}


describe('phosphor-menus', () => {

  describe('MenuBar', () => {

    describe('#constructor()', () => {

      it('should accept no arguments', () => {
        let bar = new MenuBar();
        expect(bar instanceof MenuBar).to.be(true);
      });

      it('should add the `p-MenuBar` class', () => {
        let bar = new MenuBar();
        expect(bar.hasClass('p-MenuBar')).to.be(true);
      });

    });

    describe('#dispose()', () => {

      it('should dispose of the resources held by the menu', () => {
        let bar = createMenuBar();
        bar.attach(document.body);
        bar.activeIndex = 0;
        bar.openActiveItem();
        expect(bar.childMenu).to.not.be(null);
        bar.dispose();
        expect(bar.childMenu).to.be(null);
      });

    });

    describe('#childMenu', () => {

      it('should get the child menu of the menu', () => {
        let bar = createMenuBar();
        bar.attach(document.body);
        bar.activeIndex = 0;
        bar.openActiveItem();
        expect(bar.childMenu).to.be(bar.items[0].submenu);
        bar.dispose();
      });

      it('should null if the menu does not have an open submenu', () => {
        let bar = createMenuBar();
        expect(bar.childMenu).to.be(null);
      });

    });

    describe('#childMenu', () => {

      it('should get the menu bar content node', () => {
        let bar = createMenuBar();
        expect(bar.contentNode.classList.contains('p-MenuBar-content')).to.be(true);
      });

    });

    describe('#openActiveItem()', () => {

      it('should open the submenu of the active item', () => {
        let bar = createMenuBar();
        bar.attach(document.body);
        bar.activeIndex = 0;
        bar.openActiveItem();
        expect(bar.childMenu).to.not.be(null);
        bar.dispose();
      });

      it('should bail if not visible', () => {
        let bar = createMenuBar();
        bar.activeIndex = 0;
        bar.openActiveItem();
        expect(bar.childMenu).to.be(null);
      });

      it('should bail if no item is active', () => {
        let bar = createMenuBar();
        bar.attach(document.body);
        bar.openActiveItem();
        expect(bar.childMenu).to.be(null);
        bar.dispose();
      });

    });


    describe('#onItemsChanged()', () => {

      it('should be invoked when the menu items change', () => {
        let bar = createMenuBar();
        bar.items = [];
        expect(bar.methods.indexOf('onItemsChanged')).to.not.be(-1);
      });

    });

    describe('#onActiveIndexChanged()', () => {

      it('should be invoked when the active index changes', () => {
        let bar = createMenuBar();
        bar.activeIndex = 0;
        expect(bar.methods.indexOf('onActiveIndexChanged')).to.not.be(-1);
      });

    });

    describe('#onUpdateRequest()', () => {

      it('should create the menu bar', (done) => {
        let bar = createMenuBar();
        bar.attach(document.body);
        expect(bar.methods.indexOf('onUpdateRequest')).to.be(-1);
        requestAnimationFrame(() => {
          expect(bar.methods.indexOf('onUpdateRequest')).to.not.be(-1);
          let children = bar.contentNode.childNodes;
          expect(children.length).to.be(bar.items.length);
          bar.dispose();
          done();
        });
      });

    });

    describe('#onCloseRequest()', () => {

      it('should detach the widget from the DOM', () => {
        let bar = createMenuBar();
        bar.attach(document.body);
        bar.close();
        expect(bar.methods.indexOf('onCloseRequest')).to.not.be(-1);
        expect(bar.isAttached).to.be(false);
        bar.dispose();
      });

    });

    context('key handling', () => {

      it('should trigger the active item on `Enter`', (done) => {
        let bar = createMenuBar();
        bar.attach(document.body);
        bar.activateNextItem();
        bar.openActiveItem();
        let called = false;
        bar.childMenu.items[0].handler = () => { called = true; };
        bar.childMenu.activateNextItem();
        setTimeout(() => {
          triggerKeyEvent(document.body, 'keydown', { keyCode: 13 });
          expect(called).to.be(true);
          bar.close();
          done();
        }, 0);
      });

      it('should close the leaf menu on `Escape`', (done) => {
        let bar = createMenuBar();
        bar.attach(document.body);
        bar.activateNextItem();
        bar.openActiveItem();
        bar.childMenu.activateNextItem();
        setTimeout(() => {
          triggerKeyEvent(document.body, 'keydown', { keyCode: 27 });
          expect(bar.childMenu).to.be(null);
          bar.close();
          done();
        }, 0);
      });

      it('should open the previous menu on `ArrowLeft`', (done) => {
        let bar = createMenuBar();
        bar.attach(document.body);
        bar.activateNextItem();
        bar.openActiveItem();
        bar.childMenu.activateNextItem();
        setTimeout(() => {
          triggerKeyEvent(document.body, 'keydown', { keyCode: 37 });
          expect(bar.childMenu).to.be(bar.items[4].submenu);
          bar.close();
          done();
        });
      });

      it('should close a sub menu on `ArrowLeft`', (done) => {
        let bar = createMenuBar();
        bar.attach(document.body);
        bar.activeIndex = 0;
        bar.openActiveItem();
        bar.childMenu.activeIndex = 8;
        bar.childMenu.openActiveItem();
        setTimeout(() => {
          triggerKeyEvent(document.body, 'keydown', { keyCode: 37 });
          expect(bar.childMenu.childMenu).to.be(null);
          bar.close();
          done();
        });
      });

      it('should activate the previous menu item on `ArrowUp`', (done) => {
        let bar = createMenuBar();
        bar.attach(document.body);
        bar.activateNextItem();
        bar.openActiveItem();
        bar.childMenu.activateNextItem();
        setTimeout(() => {
          triggerKeyEvent(document.body, 'keydown', { keyCode: 38 });
          expect(bar.childMenu.activeIndex).to.be(10);
          bar.close();
          done();
        }, 0);
      });

      it('should open a sub menu on `ArrowRight`', (done) => {
        let bar = createMenuBar();
        bar.attach(document.body);
        bar.activeIndex = 0;
        bar.openActiveItem();
        bar.childMenu.leafMenu.activeIndex = 8;
        setTimeout(() => {
          triggerKeyEvent(document.body, 'keydown', { keyCode: 39 });
          expect(bar.childMenu.childMenu).to.not.be(null);
          bar.close();
          done();
        }, 0);
      });

      it('should open next menu on `ArrowRight`', (done) => {
        let bar = createMenuBar();
        bar.attach(document.body);
        bar.activateNextItem();
        bar.openActiveItem();
        setTimeout(() => {
          triggerKeyEvent(document.body, 'keydown', { keyCode: 39 });
          expect(bar.childMenu).to.be(bar.items[1].submenu);
          bar.close();
          done();
        }, 0);
      });

      it('should activate the next menu item on `ArrowDown`', (done) => {
        let bar = createMenuBar();
        bar.attach(document.body);
        bar.activateNextItem();
        bar.openActiveItem();
        bar.childMenu.activateNextItem();
        setTimeout(() => {
          triggerKeyEvent(document.body, 'keydown', { keyCode: 40 });
          expect(bar.childMenu.activeIndex).to.be(1);
          bar.close();
          done();
        }, 0);
      });

      it('should activate an item based on mnemonic', (done) => {
        let bar = createMenuBar();
        bar.attach(document.body);
        bar.activeIndex = 0;
        bar.openActiveItem();
        setTimeout(() => {
          triggerKeyEvent(document.body, 'keypress', { charCode: 83 } );  // 's' key
          expect(bar.childMenu.activeIndex).to.be(2);
          bar.close();
          done();
        }, 0);
      });

    });

    context('mouse handling', () => {

      it('should trigger the item on mouse over and click', () => {
        let bar = createMenuBar();
        bar.attach(document.body);
        sendMessage(bar, Widget.MsgUpdateRequest);
        bar.activeIndex = 1;
        bar.openActiveItem();
        bar.childMenu.activeIndex = 0;
        let called = false;
        bar.childMenu.items[0].handler = () => { called = true; };
        let node = bar.childMenu.node;
        node = node.getElementsByClassName('p-Menu-item')[0] as HTMLElement;
        let rect = node.getBoundingClientRect();
        let args = { clientX: rect.left + 1, clientY: rect.top + 1 };
        triggerMouseEvent(node, 'mousedown', args);
        triggerMouseEvent(node, 'mouseup', args);
        expect(called).to.be(true);
        bar.close();
      });

      it('should open the submenu', () => {
        let bar = createMenuBar();
        bar.attach(document.body);
        sendMessage(bar, Widget.MsgUpdateRequest);
        let node = bar.contentNode.firstChild as HTMLElement;
        let rect = node.getBoundingClientRect();
        let args = { clientX: rect.left + 1, clientY: rect.top + 1 };
        triggerMouseEvent(node, 'mousedown', args);
        expect(bar.activeIndex).to.be(0);
        expect(bar.childMenu).to.be(bar.items[0].submenu);
        bar.dispose();
      });

      it('should close the submenu on an external mousedown', (done) => {
        let bar = createMenuBar();
        bar.attach(document.body);
        sendMessage(bar, Widget.MsgUpdateRequest);
        bar.activeIndex = 0;
        bar.openActiveItem();
        expect(bar.childMenu).to.be(bar.items[0].submenu);
        setTimeout(() => {
          let args = { clientX: -10, clientY: -10 };
          triggerMouseEvent(document.body, 'mousedown', args);
          expect(bar.childMenu).to.be(null);
          bar.close();
          done();
        }, 0);
      });

      it('should clear the activeIndex on mouseleave', (done) => {
        let bar = createMenuBar();
        bar.attach(document.body);
        sendMessage(bar, Widget.MsgUpdateRequest);
        bar.activeIndex = 0;
        setTimeout(() => {
          triggerMouseEvent(bar.node, 'mouseleave');
          expect(bar.activeIndex).to.be(-1);
          bar.dispose();
          done();
        }, 0);
      });

      it('should open a new submenu', (done) => {
        let bar = createMenuBar();
        bar.attach(document.body);
        sendMessage(bar, Widget.MsgUpdateRequest);
        let node = bar.contentNode.firstChild as HTMLElement;
        let rect = node.getBoundingClientRect();
        let args = { clientX: rect.left + 1, clientY: rect.top + 1 };
        triggerMouseEvent(node, 'mousedown', args);
        setTimeout(() => {
          node = bar.contentNode.childNodes[1] as HTMLElement;
          rect = node.getBoundingClientRect();
          args = { clientX: rect.left + 1, clientY: rect.top + 1 };
          triggerMouseEvent(bar.node, 'mousemove', args);
          expect(bar.childMenu).to.be(bar.items[1].submenu);
          bar.close();
          done();
        }, 0);
      });

      it('should suppress context menu events', () => {
        let bar = createMenuBar();
        bar.attach(document.body);
        let event = triggerMouseEvent(bar.node, 'contextmenu');
        expect(event.defaultPrevented).to.be(true);
        bar.dispose();
      });

      it('should bail if the left mouse button was not pressed', () => {
        let bar = createMenuBar();
        bar.attach(document.body);
        sendMessage(bar, Widget.MsgUpdateRequest);
        let node = bar.contentNode.firstChild as HTMLElement;
        let rect = node.getBoundingClientRect();
        let args = { clientX: rect.left + 1, clientY: rect.top + 1,
                     button: 1 };
        triggerMouseEvent(node, 'mousedown', args);
        expect(bar.activeIndex).to.be(-1);
        bar.dispose();
      });

      it('should close a previously opened submenu', (done) => {
        let bar = createMenuBar();
        bar.attach(document.body);
        sendMessage(bar, Widget.MsgUpdateRequest);
        let nodes = bar.contentNode.getElementsByClassName('p-MenuBar-item');
        let node = nodes[0] as HTMLElement;
        let rect = node.getBoundingClientRect();
        let args = { clientX: rect.left + 1, clientY: rect.top + 1 };
        triggerMouseEvent(node, 'mousedown', args);
        setTimeout(() => {
          debugger;
          node = nodes[1] as HTMLElement;
          rect = node.getBoundingClientRect();
          args = { clientX: rect.left + 1, clientY: rect.top + 1 };
          triggerMouseEvent(node, 'mousedown', args);
          expect(bar.childMenu).to.be(null);
          bar.close();
          done();
        }, 0);
      });

    });

  });

});
