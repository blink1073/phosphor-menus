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
  Property
} from 'phosphor-properties';

import {
  Menu, AbstractMenu, MenuItem
} from '../../lib/index';


class LogMenu extends AbstractMenu {

  methods: string[] = [];

  protected isSelectable(item: MenuItem): boolean {
    this.methods.push('isSelectable');
    return true;
  }

  protected onItemsChanged(oldItems: MenuItem[], newItems: MenuItem[]): void {
    this.methods.push('onItemsChanged');
  }

  protected onActiveIndexChanged(oldIndex: number, newIndex: number): void {
    this.methods.push('onActiveIndexChanged');
  }
}


describe('phosphor-menus', () => {

  describe('AbstractMenu', () => {

    describe('#constructor()', () => {

      it('should accept no arguments', () => {
        let base = new LogMenu();
        expect(base instanceof AbstractMenu).to.be(true);
      });

    });

    describe('#items', () => {

      it('should get the array of menu items', () => {
        let base = new LogMenu();
        expect(base.items).to.eql([]);
      });

      it('should set the array of menu items', () => {
        let base = new LogMenu();
        let items = [new MenuItem(), new MenuItem()];
        base.items = items;
        expect(base.items[0]).to.be(items[0]);
        expect(base.items[1]).to.be(items[1]);
      });

    });

    describe('#activeIndex', () => {

      it('should get the index of the active menu item', () => {
        let base = new LogMenu();
        expect(base.activeIndex).to.be(-1);
      });

      it('should set the index of the active menu item', () => {
        let base = new LogMenu();
        base.items = [new MenuItem(), new MenuItem()];
        base.activeIndex = 1;
        expect(base.activeIndex).to.be(1);
      });

      it('should be a no-op for an invalid index', () => {
        let base = new LogMenu();
        base.activeIndex = 0;
        expect(base.activeIndex).to.be(-1);
      });

    });

    describe('#activeItem', () => {

      it('should get the active menu item', () => {
        let base = new LogMenu();
        expect(base.activeItem).to.be(null);
      });

      it('should set the active menu item', () => {
        let base = new LogMenu();
        base.items = [new MenuItem(), new MenuItem()];
        base.activeItem = base.items[1]
        expect(base.activeIndex).to.be(1);
      });

      it('should set active item to `null` if invalid', () => {
        let base = new LogMenu();
        base.items = [new MenuItem(), new MenuItem()];
        base.activeItem = new MenuItem();
        expect(base.activeItem).to.be(null);
      });

    });

    describe('#activateNextItem()', () => {

      it('should activate the next selectable menu item', () => {
        let base = new LogMenu();
        base.items = [new MenuItem({ type: MenuItem.Separator }), new MenuItem()];
        base.activeIndex = 0;
        base.activateNextItem();
        expect(base.activeIndex).to.be(1);
      });

      it('should start at the current index', () => {
        let base = new LogMenu();
        base.items = [new MenuItem(), new MenuItem(), new MenuItem()];
        base.activeIndex = 1;
        base.activateNextItem();
        expect(base.activeIndex).to.be(2);
      });

      it('should wrap around at the end of the menu', () => {
        let base = new LogMenu();
        base.items = [new MenuItem(), new MenuItem()];
        base.activeIndex = 1;
        base.activateNextItem();
        expect(base.activeIndex).to.be(0);
      });

    });

    describe('#activatePreviousItem()', () => {

      it('should activate the previous selectable menu item', () => {
        let base = new LogMenu();
        base.items = [new MenuItem(), new MenuItem()];
        base.activeIndex = 1;
        base.activatePreviousItem();
        expect(base.activeIndex).to.be(0);
      });

      it('should start at the current index', () => {
        let base = new LogMenu();
        base.items = [new MenuItem(), new MenuItem(), new MenuItem()];
        base.activeIndex = 2;
        base.activatePreviousItem();
        expect(base.activeIndex).to.be(1);
      });

      it('should wrap around at the front of the menu', () => {
        let base = new LogMenu();
        base.items = [new MenuItem(), new MenuItem()];
        base.activeIndex = 0;
        base.activatePreviousItem();
        expect(base.activeIndex).to.be(1);
      });

    });

    describe('#activateMnemonicItem()', () => {

      it('should activate the next selectable menu item with the given mnemonic', () => {
        let base = new LogMenu();
        base.items = [
          new MenuItem({ text: '&foo' }),
          new MenuItem({ type: MenuItem.Separator }),
          new MenuItem({ text: '&bar' }),
          new MenuItem({ text: 'ba&z' }),
          new MenuItem({ text: '&zazzy'}),
        ];
        base.activateMnemonicItem('f');
        expect(base.activeIndex).to.be(0);
        base.activateMnemonicItem('b');
        expect(base.activeIndex).to.be(2);
        base.activateMnemonicItem('z');
        expect(base.activeIndex).to.be(3);
        base.activateMnemonicItem('z');
        expect(base.activeIndex).to.be(4);
      });

      it('should start at the current index', () => {
        let base = new LogMenu();
        base.items = [
          new MenuItem({ text: '&foo' }),
          new MenuItem({ type: MenuItem.Separator }),
          new MenuItem({ text: '&bar' }),
          new MenuItem({ text: 'ba&z' }),
          new MenuItem({ text: '&zazzy'}),
        ];
        base.activeIndex = 3;
        base.activateMnemonicItem('z');
        expect(base.activeIndex).to.be(4);
      });

      it('should be case insensitive', () => {
        let base = new LogMenu();
        base.items = [
          new MenuItem({ text: '&foo' }),
          new MenuItem({ type: MenuItem.Separator }),
          new MenuItem({ text: '&bar' }),
          new MenuItem({ text: 'ba&z' }),
          new MenuItem({ text: '&zazzy'}),
        ];
        base.activateMnemonicItem('F');
        expect(base.activeIndex).to.be(0);
        base.activateMnemonicItem('B');
        expect(base.activeIndex).to.be(2);
        base.activateMnemonicItem('Z');
        expect(base.activeIndex).to.be(3);
        base.activateMnemonicItem('Z');
        expect(base.activeIndex).to.be(4);
      });

      it('should wrap around at the end of the menu', () => {
        let base = new LogMenu();
        base.items = [
          new MenuItem({ text: '&foo' }),
          new MenuItem({ type: MenuItem.Separator }),
          new MenuItem({ text: '&bar' }),
          new MenuItem({ text: 'ba&z' }),
          new MenuItem({ text: '&zazzy'}),
        ];
        base.activeIndex = 1;
        base.activateMnemonicItem('f');
        expect(base.activeIndex).to.be(0);
      });

    });

    describe('#isSelectable()', () => {

      it('should be invoked to test whether an item is selectable', () => {
        let base = new LogMenu();
        base.items = [ new MenuItem({ text: '&foo' }) ];
        expect(base.methods.indexOf('isSelectable')).to.be(-1);
        base.activeIndex = 0;
        expect(base.methods.indexOf('isSelectable')).to.not.be(-1);
      });
    });

    describe('#onItemsChanged()', () => {

      it('should be invoked when the menu items change', () => {
        let base = new LogMenu();
        base.items = [ new MenuItem({ text: '&foo' }) ];
        expect(base.methods.indexOf('onItemsChanged')).to.not.be(-1);
      });

    });

    describe('#onActiveIndexChanged()', () => {

      it('should be called when the active index changes', () => {
        let base = new LogMenu();
        base.items = [ new MenuItem({ text: '&foo' }) ];
        expect(base.methods.indexOf('onActiveIndexChanged')).to.be(-1);
        base.activeIndex = 0;
        expect(base.methods.indexOf('onActiveIndexChanged')).to.not.be(-1);
      });

    });

  });

});
