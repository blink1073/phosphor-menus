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
  DelegateCommand
} from 'phosphor-command';

import {
  IChangedArgs, Property
} from 'phosphor-properties';

import {
  Signal
} from 'phosphor-signaling';

import {
  Menu, MenuItem, MenuItemType
} from '../../lib/index';


describe('phosphor-menus', () => {

  describe('MenuItem', () => {

    describe('.Normal', () => {

      it('should be an alias of the `Normal` MenuItemType', () => {
          expect(MenuItem.Normal).to.be(MenuItemType.Normal);
      });

    });

    describe('.Check', () => {

      it('should be an alias of the `Check` MenuItemType', () => {
          expect(MenuItem.Check).to.be(MenuItemType.Check);
      });

    });

    describe('.Separator', () => {

      it('should be an alias of the `Separator` MenuItemType', () => {
          expect(MenuItem.Separator).to.be(MenuItemType.Separator);
      });

    });

    describe('.Submenu', () => {

      it('should be an alias of the `Submenu` MenuItemType', () => {
          expect(MenuItem.Submenu).to.be(MenuItemType.Submenu);
      });

    });

    describe('#constructor()', () => {

      it('should accept no arguments', () => {
        let item = new MenuItem();
        expect(item instanceof MenuItem).to.be(true);
      });

      it('should accept an IMenuItemOptions argument', () => {
        let item = new MenuItem({
          type: MenuItemType.Normal,
          text: 'foo',
          icon: 'baz',
          shortcut: 'Ctrl+Z',
          className: 'fizz',
          command: new DelegateCommand(() => { }),
          commandArgs: 'buzz',
          submenu: new Menu()
        });
        expect(item instanceof MenuItem).to.be(true);
        expect(item.text).to.be('foo');
        expect(item.className).to.be('fizz');
      });

    });

    describe('#changed', () => {

      it('should be emitted when the menu item state changes', () => {
        let item = new MenuItem();
        let called = false;
        item.changed.connect(() => { called = true; });
        item.type = MenuItem.Separator;
        expect(called).to.be(true);
      });

    });

    describe('#type', () => {

      it('should get the type of the menu item', () => {
        let item = new MenuItem();
        expect(item.type).to.be(MenuItem.Normal);
      });

      it('should set the type of the menu item', () => {
        let item = new MenuItem();
        item.type = MenuItem.Check;
        expect(item.type).to.be(MenuItem.Check);
      });

      it('should emit the changed signal', () => {
        let item = new MenuItem();
        let args: IChangedArgs<any> = null;
        item.changed.connect((s, a) => { args = a; });
        item.type = MenuItem.Separator;
        expect(args).to.eql({
          name: 'type',
          oldValue: MenuItem.Normal,
          newValue: MenuItem.Separator,
        });
      });

    });

    describe('#text', () => {

      it('should get the text for the menu item', () => {
        let item = new MenuItem();
        expect(item.text).to.be('');
      });

      it('should set the text for the menu item', () => {
        let item = new MenuItem();
        item.text = 'foo';
        expect(item.text).to.be('foo');
      });

      it('should emit the changed signal', () => {
        let item = new MenuItem();
        let args: IChangedArgs<any> = null;
        item.changed.connect((s, a) => { args = a; });
        item.text = 'foo';
        expect(args).to.eql({
          name: 'text',
          oldValue: '',
          newValue: 'foo',
        });
      });

    });

    describe('#icon', () => {

      it('should get the icon for the menu item', () => {
        let item = new MenuItem();
        expect(item.icon).to.be('');
      });

      it('should set the icon for the menu item', () => {
        let item = new MenuItem();
        item.icon = 'fa fa-close';
        expect(item.icon).to.be('fa fa-close');
      });

      it('should emit the changed signal', () => {
        let item = new MenuItem();
        let args: IChangedArgs<any> = null;
        item.changed.connect((s, a) => { args = a; });
        item.icon = 'fa fa-close';
        expect(args).to.eql({
          name: 'icon',
          oldValue: '',
          newValue: 'fa fa-close',
        });
      });

    });

    describe('#shortcut', () => {

      it('should get the shortcut key for the menu item', () => {
        let item = new MenuItem();
        expect(item.shortcut).to.be('');
      });

      it('should set the shortcut key for the menu item', () => {
        let item = new MenuItem();
        item.shortcut = 'ctrl+x';
        expect(item.shortcut).to.be('ctrl+x');
      });

      it('should emit the changed signal', () => {
        let item = new MenuItem();
        let args: IChangedArgs<any> = null;
        item.changed.connect((s, a) => { args = a; });
        item.shortcut = 'Ctrl+C';
        expect(args).to.eql({
          name: 'shortcut',
          oldValue: '',
          newValue: 'Ctrl+C',
        });
      });

    });

    describe('#className', () => {

      it('should get the extra class name for the menu item', () => {
        let item = new MenuItem();
        expect(item.className).to.be('');
      });

      it('should set the extra class name for the menu item', () => {
        let item = new MenuItem();
        item.className = 'foo';
        expect(item.className).to.be('foo');
      });

      it('should emit the changed signal', () => {
        let item = new MenuItem();
        let args: IChangedArgs<any> = null;
        item.changed.connect((s, a) => { args = a; });
        item.className = 'foo';
        expect(args).to.eql({
          name: 'className',
          oldValue: '',
          newValue: 'foo',
        });
      });

    });

    describe('#command', () => {

      it('should get the command for the menu item', () => {
        let item = new MenuItem();
        expect(item.command).to.be(null);
      });

      it('should set the command for the menu item', () => {
        let item = new MenuItem();
        let command = new DelegateCommand(() => { });
        item.command = command;
        expect(item.command).to.be(command);
      });

      it('should emit the changed signal', () => {
        let item = new MenuItem();
        let command = new DelegateCommand(() => { });
        let args: IChangedArgs<any> = null;
        item.changed.connect((s, a) => { args = a; });
        item.command = command;
        expect(args).to.eql({
          name: 'command',
          oldValue: null,
          newValue: command,
        });
      });

    });

    describe('#commandArgs', () => {

      it('should get the command args for the menu item', () => {
        let item = new MenuItem();
        expect(item.command).to.be(null);
      });

      it('should set the command args for the menu item', () => {
        let item = new MenuItem();
        let args = {};
        item.commandArgs = args;
        expect(item.commandArgs).to.be(args);
      });

      it('should emit the changed signal', () => {
        let item = new MenuItem();
        let args: IChangedArgs<any> = null;
        item.changed.connect((s, a) => { args = a; });
        item.commandArgs = {};
        expect(args).to.eql({
          name: 'commandArgs',
          oldValue: null,
          newValue: {},
        });
      });

    });

    describe('#submenu', () => {

      it('should get the submenu for the menu item', () => {
        let item = new MenuItem();
        expect(item.submenu).to.be(null);
      });

      it('should set the submenu for the menu item', () => {
        let item = new MenuItem();
        let submenu = new Menu();
        item.submenu = submenu;
        expect(item.submenu).to.be(submenu);
      });

      it('should emit the changed signal', () => {
        let item = new MenuItem();
        let submenu = new Menu();
        let args: IChangedArgs<any> = null;
        item.changed.connect((s, a) => { args = a; });
        item.submenu = submenu;
        expect(args).to.eql({
          name: 'submenu',
          oldValue: null,
          newValue: submenu,
        });
      });

    });

  });

});
