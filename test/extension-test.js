'use strict';
/* eslint-env node, mocha */
/* global expect */
/* eslint prefer-arrow-callback: 0 */
/* eslint no-unused-expressions: 0 */
const expect = require('chai').expect;

const libExt = require('../index');

describe('Extension', function () {
  const ext = libExt.create('testExt', obj => `${obj.test} ok!`);
  class Test {
    get test() {
      return 'test';
    }
  }

  describe('#create', function () {
    it('should return an extension object', function () {
      expect(ext.name).to.eq('testExt');
      expect(ext.static).to.be.a('function');
      expect(ext.extend).to.be.a('function');
    });

    it('should allow calling the static method directly', function () {
      const test = new Test();
      expect(ext.static(test)).to.eq('test ok!');
    });

    it('should allow extending an object with the extension method', function () {
      const test = new Test();
      ext.extend(test);
      expect(test.testExt()).to.eq('test ok!');
    });

    it('should reset extensions', function () {
      const test = new Test();
      ext.extend(test);
      ext.reset(test);
      expect(test.testExt).to.be.undefined;
    });

    it('should fail resetting functions if they are not extensions', function () {
      const test = new Test();
      test.testExt = () => 'test!';
      expect(() => ext.reset(test)).to.throw(/different from the library/);
    });
  });

  describe('#bundle', function () {
    const bundle = libExt.bundle([ext]);

    it('should extend an object', function () {
      const test = new Test();
      bundle.extend(test);
      expect(test.testExt()).to.eq('test ok!');
    });

    it('should allow calling the static method directly', function () {
      const test = new Test();
      expect(bundle.testExt(test)).to.eq('test ok!');
    });

    it('should allow extending a prototype', function () {
      class Test2 extends Test {}
      bundle.extend(Test2.prototype);
      expect(new Test2().testExt()).to.eq('test ok!');
    });

    it('should warn if the method was already implemented', function () {
      const ext2 = libExt.create('test', obj => `${obj.test} ok!`);
      const bundle2 = libExt.bundle([ext2]);
      const test = new Test();
      expect(() => bundle2.extend(test)).to.throw('\'test\' already exists!');
    });

    it('should reset all added extensions', function () {
      const ext1 = libExt.create('ext1', obj => `${obj.test} ok!`);
      const ext2 = libExt.create('ext2', obj => `${obj.test} ok!`);
      const bundle2 = libExt.bundle([ext1, ext2]);
      const test = new Test();
      bundle2.extend(test);
      expect(test.ext1).to.be.a('Function');
      expect(test.ext2).to.be.a('Function');
      bundle2.reset(test);
      expect(test.ext1).to.be.undefined;
      expect(test.ext2).to.be.undefined;
    });
  });
});
