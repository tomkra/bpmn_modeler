(function() {
  var configuration = {
    chunkWidth: 500,
    chunkHeight: 500
  };

  function initializeWorld(ctx) {
    var offscreenRenderCanvas = document.getElementById("canvas");
    var offscreenRenderCtx = offscreenRenderCanvas.getContext("2d");

    offscreenRenderCanvas.width = configuration.chunkWidth;
    offscreenRenderCanvas.height = configuration.chunkHeight;

    var canvas = ctx.canvas;

    var infinity = {
      position: {
        x: 0,
        y: 0
      },
      // stores ImageData per chunk, used to draw on
      chunks: {},
      canvas: canvas,
      ctx: ctx,
      configuration: configuration,
      debugMode: false
    };

    function constructChunkKey(x, y) {
      return x.toString() + ", " + y.toString();
    }

    function parseChunkKey(key) {
      var split = key.split(", ");

      return {
        x: parseInt(split[0]),
        y: parseInt(split[1])
      };
    }

    function worldCoordToChunkCoord(x, y) {
      return {
        x: Math.floor(x / configuration.chunkWidth),
        y: Math.floor(y / configuration.chunkHeight)
      };
    }

    function chunkCoordToWorldCoord(x, y) {
      return {
        x: x * configuration.chunkWidth,
        y: y * configuration.chunkHeight
      };
    }

    function chunkCoordToRenderCoord(x, y) {
      // Takes a chunk position
      // returns corresponding (x, y) coordinates in the viewport
      return {
        x: x * configuration.chunkWidth - infinity.position.x,
        y: y * configuration.chunkHeight - infinity.position.y
      };
    }

    function getChunk(chunkId) {
      // if the chunk doesn't exist, create it
      if (!infinity.chunks[chunkId]) {
        infinity.chunks[chunkId] = new Image(
          configuration.chunkWidth,
          configuration.chunkHeight
        );
      }

      //we're sure that it exists, return
      return infinity.chunks[chunkId];
    }

    function renderChunks(chunks) {
      Object.keys(chunks).forEach(function(key) {
        var coord = parseChunkKey(key);
        var renderCoordinate = chunkCoordToRenderCoord(coord.x, coord.y);
        try {
          ctx.drawImage(
            infinity.chunks[key],
            renderCoordinate.x,
            renderCoordinate.y
          );
        } catch (error) {
          if (error.name === "NS_ERROR_NOT_AVAILABLE") {
          } else {
            throw error;
          }
        }
      });
    }

    function getChunksInViewport() {
      var chunksInViewport = {};

      var topLeft = worldCoordToChunkCoord(
        infinity.position.x,
        infinity.position.y
      );
      var bottomRight = worldCoordToChunkCoord(
        infinity.position.x + canvas.width,
        infinity.position.y + canvas.height
      );

      var chunksOnXAxis = Math.abs(topLeft.x - bottomRight.x);
      var chunksOnYAxis = Math.abs(topLeft.y - bottomRight.y);

      for (var x = 0; x <= chunksOnXAxis; x++) {
        for (var y = 0; y <= chunksOnYAxis; y++) {
          var chunkKey = constructChunkKey(topLeft.x + x, topLeft.y + y);
          chunksInViewport[chunkKey] = getChunk(chunkKey);
        }
      }

      return chunksInViewport;
    }

    //API Methods

    infinity.updateChunks = function() {
      var chunks = getChunksInViewport();

      Object.keys(chunks).forEach(function(key) {
        var coord = parseChunkKey(key);
        var renderCoord = chunkCoordToRenderCoord(coord.x, coord.y);
        var chunkWorldCoord = chunkCoordToWorldCoord(coord.x, coord.y);

        var chunkSourceCoord = {
          x: Math.max(renderCoord.x, 0),
          y: Math.max(renderCoord.y, 0)
        };

        var width =
          Math.min(renderCoord.x + configuration.chunkWidth, canvas.width) -
          chunkSourceCoord.x;
        var height =
          Math.min(renderCoord.y + configuration.chunkHeight, canvas.height) -
          chunkSourceCoord.y;

        if (width <= 0 || height <= 0) return;

        var putLocation = {
          x: configuration.chunkWidth - width,
          y: configuration.chunkHeight - height
        };

        if (chunkWorldCoord.x >= infinity.position.x) {
          putLocation.x = 0;
        }

        if (chunkWorldCoord.y >= infinity.position.y) {
          putLocation.y = 0;
        }

        if (chunks[key].src) {
          offscreenRenderCtx.drawImage(chunks[key], 0, 0);
        }

        // clear the visible part of the chunk
        offscreenRenderCtx.clearRect(
          putLocation.x,
          putLocation.y,
          width,
          height
        );
        // render the contents of the main canvas to the offscreen context
        offscreenRenderCtx.drawImage(
          canvas,
          chunkSourceCoord.x,
          chunkSourceCoord.y,
          width,
          height,
          putLocation.x,
          putLocation.y,
          width,
          height
        );
        if (configuration.debugMode) {
          offscreenRenderCtx.strokeRect(
            0,
            0,
            configuration.chunkWidth,
            configuration.chunkHeight
          );
          offscreenRenderCtx.fillText(key, 15, 15);
        }
        // serialize the offscreen context
        infinity.chunks[key].src = offscreenRenderCtx.canvas.toDataURL();
        // finally, clear up the offscreen context so the contents won't be dupllicated to other chunks later in this loop
        offscreenRenderCtx.clearRect(
          0,
          0,
          configuration.chunkWidth,
          configuration.chunkHeight
        );
      });
    };

    infinity.moveBy = function(dx, dy, render) {
      // default `render` to true, only skip rendering when it's false
      render = render === undefined ? true : render;
      infinity.position.x += dx;
      infinity.position.y += dy;

      if (render) {
        renderChunks(getChunksInViewport());
      }
    };

    infinity.moveTo = function(x, y, render) {
      // default `render` to true, only skip rendering when it's false
      render = render === undefined ? true : render;
      infinity.position.x = x;
      infinity.position.y = y;

      if (render) {
        renderChunks(getChunksInViewport());
      }
    };

    infinity.refresh = function() {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      infinity.moveBy(0, 0);
    };

    infinity.getAllChunks = function() {
      return infinity.chunks;
    };

    // expects a chunk-id, ex "2, 3" and an <img></img> with a src
    infinity.loadChunk = function(chunkId, chunk) {
      infinity.chunks[chunkId] = chunk;
      infinity.refresh();
    };

    return infinity;
  }

  window.infiniteCanvas = {
    initialize: initializeWorld
  };
})();
