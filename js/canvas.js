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
    
    // Add a default background.
    this.backgroundUrl = '/img/canvas-default-background-texture.png';
    this.backgroundTexture = PIXI.Texture.fromImage(this.backgroundUrl);
    this.backgroundSprite = new PIXI.TilingSprite(this.backgroundTexture, elemWidth, elemHeight);
    this.stage.addChild(this.backgroundSprite);

    
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
        
        // Resize the background texture.
        that.setBackgroundImage(that.backgroundUrl);
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
   * Sets a background image for the canvas.
   * There are three options: mode, tileScale and tilePosition.
   *
   * Mode has two possible values:
   * When mode is scale, then the background image is stretched (without
   * preserving aspect ratio of the input image). When mode is tile, then
   * the input image is tiled to fill the entire area. The default value is
   * 'scale'.
   *
   * tileScale and tilePosition are only relevant when the mode is tile.
   *
   * tileScale specifies the scaling factor of tiles. The scaling factor has
   * both x and y components. By default, both x and y components are 1.0.
   *
   * tilePosition specifies the offset of the tiles from the top left corner.
   * The position has both x and y components. By default, these are 0.0.
   */
  my.Canvas.prototype.setBackgroundImage = function(url, options) {
    if (url === undefined) {
      throw 'VisualIDE.Canvas: setBackgroundImage requires url argument';
    }
    
    options = options || {};
    options.mode = options.mode || 'scale';
    options.tileScale = options.tileScale || {
      x: 1.0,
      y: 1.0
    };
    options.tilePosition = options.tilePosition || {
      x: 0.0,
      y: 0.0
    };
    
    this.backgroundUrl = url;
    var loader = new PIXI.ImageLoader(url);
    loader.onLoaded = function(that) {
      return function() {
        that.backgroundTexture = PIXI.Texture.fromImage(url);
        that.backgroundSprite.setTexture(that.backgroundTexture);
        
        var elemWidth = that.width * that.scale;
        var elemHeight = that.height * that.scale;
        
        // Scale a single tile to fill the entire element.
        if (options.mode === 'scale') {
          that.backgroundSprite.tileScale = {
            x: elemWidth / that.backgroundTexture.width,
            y: elemHeight / that.backgroundTexture.height
          };
        } else {
          that.backgroundSprite.tileScale = options.tileScale;
          that.backgroundSprite.tilePosition = options.tilePosition;
        }
        
        that.backgroundSprite.width = elemWidth;
        that.backgroundSprite.height = elemHeight;
      };
    }(this);
    
    loader.load();
  };
  
  /**
   * Clears the background image for the canvas.
   */
  my.Canvas.prototype.clearBackgroundImage = function() {
    this.setBackgroundImage('/img/canvas-default-background-texture.png');
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

    // Define a property animator so that we can animate properties easily.
    this.animateProperty = function(that) {
      return function(propertySetter, propertyGetter, newValue, interpolator,
          duration, callback) {
        var orig = propertyGetter.call(that);
        var startTime = null;
        var animFrame = function(timestamp) {
          if (startTime === null) {
            startTime = timestamp;
          }

          var elapsed = timestamp - startTime;
          if (elapsed < duration) {
            var interpolation = interpolator.getInterpolation(elapsed / duration);
            propertySetter.call(that, orig + ((newValue - orig) * interpolation));
            requestAnimFrame(animFrame);
          } else {
            propertySetter.call(that, newValue);
            callback.call(that);
          }
        };

        requestAnimFrame(animFrame);
      };
    }(this);
    
    this.texture = PIXI.Texture.fromImage(url);
    this.sprite = new PIXI.Sprite(this.texture);
  };

  /**
   * Gets the position of the sprite.
   */
  my.CanvasSprite.prototype.getX = function() {
    return this.sprite.position.x;
  };

  my.CanvasSprite.prototype.getY = function() {
    return this.sprite.position.y;
  };
  
  /**
   * Sets the position of the sprite.
   */
  my.CanvasSprite.prototype.setX = function(x, options) {
    if (x === undefined) {
      throw 'VisualIDE.CanvasSprite: setX requires x argument';
    }
    
    if (!isFinite(x)) {
      throw 'VisualIDE.CanvasSprite: setX argument x should be a number';
    }

    options = options || {};
    options.interpolator = options.interpolator || undefined;
    options.duration = options.duration || 1000;
    options.callback = options.callback || function() { };

    if (options.interpolator !== undefined &&
        options.interpolator.getInterpolation) {
      this.animateProperty(this.setX, this.getX, x, options.interpolator,
          options.duration, options.callback);
    } else {
      this.sprite.position.x = x;
    }
  };

  my.CanvasSprite.prototype.setY = function(y, options) {
    if (y === undefined) {
      throw 'VisualIDE.CanvasSprite: setY requires y argument';
    }
    
    if (!isFinite(y)) {
      throw 'VisualIDE.CanvasSprite: setY argument y should be a number';
    }
    
    options = options || {};
    options.interpolator = options.interpolator || undefined;
    options.duration = options.duration || 1000;
    options.callback = options.callback || function() { };

    if (options.interpolator !== undefined &&
        options.interpolator.getInterpolation) {
      this.animateProperty(this.setY, this.getY, y, options.interpolator,
          options.duration, options.callback);
    } else {
      this.sprite.position.y = y;
    }
  };
  
  my.CanvasSprite.prototype.setPosition = function(x, y, options) {
    this.setX(x, options);
    this.setY(y, options);
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

  /**
   * An interpolator defines the rate of change of an animation. This allows
   * for basic animation effects to be accelerated, decelerated, repeated,
   * etc.
   */
  my.CanvasBaseInterpolator = function() { };

  /**
   * Maps a value representing the elapsed fraction of an animation to a value
   * that represents the interpolated fraction.
   */
  my.CanvasBaseInterpolator.prototype.getInterpolation = function(input) {
    throw 'VisualIDE.CanvasBaseInterpolator: should not be initialized';
  };

  /**
   * An interpolator where the rate of change is constant.
   */
  my.CanvasLinearInterpolator = function() { };
  my.CanvasLinearInterpolator.prototype = new my.CanvasBaseInterpolator();
  my.CanvasLinearInterpolator.prototype.getInterpolation = function(input) {
    return input;
  };

  /**
   * An interpolator where the rate of change starts out slowly and then
   * accelerates.
   */
  my.CanvasAccelerateInterpolator = function(factor) {
    if (factor === undefined) {
      factor = 1.0;
    }

    if (!isFinite(factor)) {
      throw 'VisualIDE.CanvasAccelerateInterpolator: factor argument should ' +
        'be a number';
    }

    this.factor = 1.0;
    this.doubleFactor = 2.0 * factor;
  };

  my.CanvasAccelerateInterpolator.prototype = new my.CanvasBaseInterpolator();
  my.CanvasAccelerateInterpolator.prototype.getInterpolation = function(input) {
    if (this.factor === 1.0) {
      return input * input;
    } else {
      return Math.pow(input, this.doubleFactor);
    }
  };

  /**
   * An interpolator where the rate of change starts out quickly and then
   * decelerates.
   */
  my.CanvasDecelerateInterpolator = function(factor) {
    if (factor === undefined) {
      factor = 1.0;
    }

    if (!isFinite(factor)) {
      throw 'VisualIDE.CanvasDecelerateInterpolator: factor argument should ' +
        'be a number';
    }

    this.factor = factor;
  };

  my.CanvasDecelerateInterpolator.prototype = new my.CanvasBaseInterpolator();
  my.CanvasDecelerateInterpolator.prototype.getInterpolation = function(input) {
    var result = null;
    if (this.factor === 1.0) {
      result = (1.0 - (1.0 - input) * (1.0 - input));
    } else {
      result = (1.0 - Math.pow((1.0 - input), 2 * this.factor));
    }

    return result;
  };

  /**
   * An interpolator where the rate of change starts and ends slowly but
   * accelerates through the middle.
   */
  my.CanvasEasingInterpolator = function(factor) {
    if (factor === undefined) {
      factor = 1.0;
    }

    if (!isFinite(factor)) {
      throw 'VisualIDE.CanvasEasingInterpolator: factor argument should ' +
        'be a number';
    }

    this.factor = factor;
  };

  my.CanvasEasingInterpolator.prototype = new my.CanvasBaseInterpolator();
  my.CanvasEasingInterpolator.prototype.getInterpolation = function(input) {
    if (this.factor === 1.0) {
      return 1.0 - (Math.cos(input * Math.PI) / 2.0 + 0.5);
    } else {
      return Math.pow(1.0 - (Math.cos(input * Math.PI) / 2.0 + 0.5), this.factor);
    }
  };

  /**
   * An interpolator where the change bounces at the end.
   */
  my.CanvasBounceInterpolator = function() {
    this.bounce = function(t) {
      return t * t * 8.0;
    };
  };

  my.CanvasBounceInterpolator.prototype = new my.CanvasBounceInterpolator();
  my.CanvasBounceInterpolator.prototype.getInterpolation = function(input) {
    input *= 1.1226;
    if (input < 0.3535) return this.bounce(input);
    else if (input < 0.7408) return this.bounce(input - 0.54719) + 0.7;
    else if (input < 0.9644) return this.bounce(input - 0.8526) + 0.9;
    else return this.bounce(input - 1.0435) + 0.95;
  };
  
  return my;

}(VisualIDE || {}));
