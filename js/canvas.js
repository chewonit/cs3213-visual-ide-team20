/**
 * CS3212 Software Systems Design
 * Visual IDE - Team 20
 */

var VisualIDE = (function(my) {
  'use strict';

  /**
   * A rendering area, powered by Pixi.js.
   * This canvas is used to render the sprites.
   */
  my.Canvas = function(elem) {
    if (!elem || !elem.nodeType || elem.nodeType != Node.ELEMENT_NODE) {
      throw 'VisualIDE.Canvas: a DOM element is required as the first argument';
    }
    
    // Initialize some class variables that we will use later on.
    this.sprites = {};
    
    // Obtain the size of the rendering area so we can do proportional scaling
    // later on. Height of an empty div is always zero, but the width expands
    // to fill its container.
    var elemWidth = elem.clientWidth;
    
    // Pixi's default canvas is 800x600 pixels, so let's use that and compute
    // a scaling factor to apply to the element. We use CSS3 scaling transforms
    // for efficient scaling (highly possibly done on the GPU).
    this.width = 800;
    this.height = 600;
    this.scale = elemWidth / this.width;
    var elemHeight = this.height * this.scale;
    
    // Set up the stage.
    this.stage = new PIXI.Stage(0xffffff);
    this.renderer = PIXI.autoDetectRenderer(elemWidth, elemHeight);
    elem.appendChild(this.renderer.view);
    
    // Define the animation function and begin rendering.
    var animate = function(that) {
      return function() {
        requestAnimFrame(animate);
        that.renderer.render(that.stage);
      };
    }(this);
    
    // Create a resize listener so we can scale as needed.
    this.resizeListener = function(that) {
      return function() {
        elemWidth = elem.clientWidth;
        that.scale = elemWidth / that.width;
        elemHeight = that.height * that.scale;
        that.renderer.resize(elemWidth, elemHeight);
      };
    }(this);
    
    // Attach the listener to the window.
    window.addEventListener('resize', this.resizeListener, false);
    
    // Kick off the render loop.
    requestAnimFrame(animate);
  };
  
  /**
   * Sets the rendered size of the canvas.
   *
   * Note that this is not necessarily the actual displayed width and height of
   * what is shown on screen - that depends on the space available to the
   * container element. If the container element is not equal in size, then
   * shown area is scaled proportionally to match the container element.
   */
  my.Canvas.prototype.setSize = function(width, height) {
    if (width === undefined || height === undefined) {
      throw 'VisualIDE.Canvas: setSize requires width and height arguments';
    }
    
    if (!isFinite(width) || !isFinite(height) || width <= 0 || height <= 0) {
      throw 'VisualIDE.Canvas: setSize width and height must be numbers and ' +
            'greater than zero';
    }
    
    this.height = height;
    this.width = width;
    
    // Repaint the rendering area.
    this.resizeListener();
  };
  
  /**
   * Sets the background color of the canvas.
   */
  my.Canvas.prototype.setBackgroundColor = function(backgroundColor) {
    if (backgroundColor === undefined) {
      throw 'VisualIDE.Canvas: setBackgroundColor requires backgroundColor ' +
            'argument';
    }
    
    this.stage.setBackgroundColor(backgroundColor);
  };
  
  /**
   * Adds a sprite on the canvas.
   */
  my.Canvas.prototype.addSprite = function(name, sprite) {
    if (name === undefined || sprite === undefined) {
      throw 'VisualIDE.Canvas: registerSprite requires name and sprite ' +
            'arguments';
    }
    
    if (this.sprites.hasOwnProperty(name)) {
      throw 'VisualIDE.Canvas: registerSprite sprite with same name already ' +
            'exists';
    }
    
    if (!sprite.sprite) {
      throw 'VisualIDE.Canvas: registerSprite argument sprite should be a ' +
            'CanvasSprite';
    }
    
    this.sprites[name] = sprite;
    this.stage.addChild(sprite.sprite);
  };
  
  /**
   * Returns a sprite on the canvas.
   * If the sprite was not found, this returns null.
   */
  my.Canvas.prototype.getSprite = function(name) {
    if (name === undefined) {
      throw 'VisualIDE.Canvas: getSprite requires name argument';
    }
    
    if (!this.sprites.hasOwnProperty(name)) {
      return null;
    } else {
      return this.sprites[name];
    }
  };
  
  /**
   * Removes a sprite from the canvas.
   */
  my.Canvas.prototype.removeSprite = function(name) {
    if (name === undefined) {
      throw 'VisualIDE.Canvas: removeSprite requires name argument';
    }
    
    if (!this.sprites.hasOwnProperty(name)) {
      throw 'VisualIDE.Canvas: removeSprite sprite does not exist';
    }
    
    this.stage.removeChild(this.sprites[name].sprite);
    delete this.sprites[name];
  };
  
  /**
   * A Sprite object.
   */
  my.CanvasSprite = function(url) {
    if (url === undefined) {
      throw 'VisualIDE.CanvasSprite: requires url argument';
    }
    
    this.texture = PIXI.Texture.fromImage(url);
    this.sprite = new PIXI.Sprite(this.texture);
  };
  
  /**
   * Sets the position of the sprite.
   */
  my.CanvasSprite.prototype.setX = function(x) {
    if (x === undefined) {
      throw 'VisualIDE.CanvasSprite: setX requires x argument';
    }
    
    if (!isFinite(x)) {
      throw 'VisualIDE.CanvasSprite: setX argument x should be a number';
    }
    
    this.sprite.position.x = x;
  };
  
  my.CanvasSprite.prototype.setY = function(y) {
    if (y === undefined) {
      throw 'VisualIDE.CanvasSprite: setY requires y argument';
    }
    
    if (!isFinite(y)) {
      throw 'VisualIDE.CanvasSprite: setY argument y should be a number';
    }
    
    this.sprite.position.y = y;
  };
  
  my.CanvasSprite.prototype.setPosition = function(x, y) {
    this.setX(x);
    this.setY(y);
  };
  
  /**
   * Sets the visibility of the sprite.
   */
  my.CanvasSprite.prototype.setVisible = function(visible) {
    if (visible === undefined) {
      throw 'VisualIDE.CanvasSprite: setVisible requires visible argument';
    }
    
    this.sprite.visible = visible;
  };
  
  my.CanvasSprite.prototype.hide = function() {
    this.setVisible(false);
  };
  
  my.CanvasSprite.prototype.show = function() {
    this.setVisible(true);
  };
  
  /**
   * Sets a new image for the sprite.
   */
  my.CanvasSprite.prototype.setImage = function(url) {
    if (url === undefined) {
      throw 'VisualIDE.CanvasSprite: setImage requires url argument';
    }
    
    this.texture = PIXI.Texture.fromImage(url);
    this.sprite.setTexture(this.texture);
  };
  
  return my;

}(VisualIDE || {}));
