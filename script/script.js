/***Send images to modal and launch***/

$('.app-image').click(function (e) {
    let location = $(e.target).attr('src')
    let caption = $(e.target).attr('data-caption')
    $('#neatModalImg').attr('src', location);
    $('#img-modal').fadeIn(500);
    $('#img-caption').html(caption);
});

/***Send videos to modal and launch***/

$('.caravan-video').click(function (e) {
    let location = $(e.target).attr('src')
    // let caption = $(e.target).attr('data-caption')
    $('#neatModalVideo').attr('src', location);
    $('#video-modal').fadeIn(500);
    // $('#img-caption').html(caption);
});

/***Fade in Splash Screen on Load***/

$(document).ready(function(){
    $('.splash-container').fadeIn(700);
});

/***Close Splash Screen***/

$('.splash-btn').click(function () {
    $('.splash-container').fadeOut(700);
})

/***Close Filter Pane***/

$('#filter-close').click(function () {
    $('.filter-legend-container').fadeOut(700);
    $('.right-panel-btn-container').css('display', 'flex'); 
})

/***Open Filter Pane***/

$('#filter-btn').click(function () {
    $('.filter-legend-container').fadeIn(700);
    $('.right-panel-btn-container').css('display', 'none').fadeOut(700);
})

/***Trigger About Modal***/

$('.nav-item:nth-of-type(5)').click(function () {
  $('#about-modal').fadeIn(500);
})

/***Close all modals***/

$('#about-close, #img-close, #video-close, #transcript-close').click(function () {
    $('#img-modal').fadeOut(500);
    $('#video-modal').fadeOut(500);
    $('#about-modal').fadeOut(500);
    $('#transcript-modal').fadeOut(500);
})

/***Open / Close side panel***/

$('#panel-btn').click(function(){
    $('.side-panel').toggleClass('on');
    $('#panel-btn').toggleClass('on');
});

$('#panel-close').click(function(){
    $('.side-panel').removeClass('on');
    $('#panel-btn').toggleClass('on');
});

/***Open / Close about panel***/

$('#help-btn').click(function(){
    $('.help-panel').toggleClass('on');
    $('#help-btn').toggleClass('on');
});

$('#help-close').click(function(){
    $('.help-panel').toggleClass('on');
    $('#help-btn').toggleClass('on');
});

/***Start ArcGIS JS***/

require(["esri/views/SceneView", "esri/WebScene", "esri/layers/FeatureLayer", "esri/layers/TileLayer", "esri/layers/VectorTileLayer", "esri/core/reactiveUtils", "esri/Basemap"], (SceneView, WebScene, FeatureLayer, TileLayer, VectorTileLayer, reactiveUtils, Basemap) => {

    /***Add Layers***/

    const caravanStops = new FeatureLayer({
      url: "https://services2.arcgis.com/njxlOVQKvDzk10uN/arcgis/rest/services/CaravanStops/FeatureServer",
      //maxScale: 0,
      popupEnabled: false,
      id: 'caravanStops',
      renderer: stopRendererSmall,
      outFields: ["*"],
      labelingInfo: null,
    });

    const caravanRoutes = new FeatureLayer({
      url: "https://services2.arcgis.com/njxlOVQKvDzk10uN/arcgis/rest/services/Caravan_Routes_Final_Erase/FeatureServer",
      maxScale: 0,
      popupEnabled: false,
      id: 'caravanRoutes',
      outFields: ["*"],
      renderer: routeRendererLarge
    });

    /***Basemap Layers***/

    const vectorTileLayer = new VectorTileLayer({
        portalItem: {
          id: "86a5d38d9933473cb9c7645f61068295", // Custom CRMP Basemap
        },
        opacity: 0.75,
      });

    const hillshadeTileLayer = new TileLayer({
      portalItem: {
        id: "1b243539f4514b6ba35e7d995890db1d", // World Hillshade
      },
    });

    const customBasemap = new Basemap({ baseLayers: [hillshadeTileLayer, vectorTileLayer] });

    /***Create Map and SceneView***/

    const map = new WebScene({
        //basemap: "topo-3d",
        basemap: customBasemap,
        ground: "world-elevation",
        layers: [caravanRoutes, caravanStops]
    });

    //map.ground.opacity = 1;

    const view = new SceneView({
        container: "viewDiv",
        map: map,
        qualityProfile: "high",
        highlights: [
          {name: "custom", color: "#649b92", haloColor: "#649b92", haloOpacity: 0.9, fillOpacity: 0.5, shadowOpacity: 0.2}
        ],
        environment: {
          background:{
              type: "color", 
              color: [244, 245, 240, 1]
          },
          atmosphereEnabled: false,
          starsEnabled: false
        },
        constraints: {
          altitude: {
            min: 30000,
            max: 8000000
          }
        },
        camera: {
          position: {
            // spatialReference: {
            //   latestWkid: 3857,
            //   wkid: 2857
            // },
            x: -97.3497654896104,
            y: 38.938391919294915,
            z: 7783963.6349063385
          },
          heading: 359.627264859108,
          tilt: 0.22518567955045343
        },
        ui: {
            components: []
        },
        viewingMode: "global"
    });

    /***Start Popup HitTest Functionality***/

    //City popup text selectors

    let imgUrl = document.getElementById('city-popup-image-id');
    let caravan = document.querySelector('.caravan')
    let cityStateDate = document.querySelector('.city-state-date');
    let details = document.querySelector('.details');

    //Caravan route popup text selectors

    // let imgUrlTwo = document.getElementById('caravan-popup-image-id');
    let caravanInfo = document.querySelector('.caravan-info');
    let caravanNum = document.querySelector('.caravan-number');
    let caravanImg = document.getElementById('caravan-popup-image-id');
    let caravanVideo = document.querySelector('.caravan-video');

    //Create highlight variable

    let highlight;

    view.on("immediate-click", (event) => {
      view.hitTest(event).then((hitResult) => {
    
        if (hitResult.results.length > 0 && hitResult.results[0].graphic.layer.id == "caravanStops") {

          const number = hitResult.results[0].graphic.attributes.CaravanNumber;
          const carName = hitResult.results[0].graphic.attributes.CaravanName;
          const carCity = hitResult.results[0].graphic.attributes.City;
          const carState = hitResult.results[0].graphic.attributes.State;
          const carDate = hitResult.results[0].graphic.attributes.Date;
          const carDetails = hitResult.results[0].graphic.attributes.Details;

          caravan.innerHTML = carName;
          cityStateDate.innerHTML = `${carCity}, ${carState} (${carDate})`;
          details.innerHTML = carDetails;

          $('#city-card').fadeIn();
          $('#caravan-card').fadeOut();

          //Temp image functionality//

          const imageOne = "./assets/images/placeholder2.jpg";
          const imageTwo = "./assets/images/placeholder4.jpg";

          if(number % 2 == 0) {
            imgUrl.src = `${imageOne}`
          } else {
            imgUrl.src = `${imageTwo}`
          }

          //End Temp image functionality//
          
          //Add highlight functionality//

          let result = hitResult.results[0].graphic;

          view.whenLayerView(result.layer).then((layerView) => {
              highlight?.remove();
              highlight = layerView.highlight(result, { name: "custom"});
          });


        } else if (hitResult.results.length > 0 && hitResult.results[0].graphic.layer.id == "caravanRoutes") {

          const carNumber = hitResult.results[0].graphic.attributes.CarNum;
          const carName = hitResult.results[0].graphic.attributes.CarNam1;
          const carNameTwo = hitResult.results[0].graphic.attributes.CarNam2;

          caravanInfo.innerHTML = `Caravan Number ${carNumber}`;
          caravanNum.innerHTML = `${carName} (${carNameTwo})`;

          $('#city-card').fadeOut();
          $('#caravan-card').fadeIn();

          if (carNumber == 1 || carNumber == 4) {
              caravanImg.classList.add('toggle');
              caravanVideo.classList.remove('toggle');
          } else {
              caravanVideo.classList.add('toggle');
              caravanImg.classList.remove('toggle');
          }
            
          //Dynamically Add Image or Video to Popup//

          // const caravanVideoOne = "./assets/video/Caravan1_PopupVideo.mp4";
          const caravanVideoOne = "https://static.videezy.com/system/resources/previews/000/038/524/original/2018-01-7-_29_.mp4";
          const caravanImageTwo = "./assets/images/Caravan2_PopupImage.jpg"
          const caravanImageThree = "./assets/images/Caravan3_PopupImage.jpg"
          const caravanVideoFour = "https://static.videezy.com/system/resources/previews/000/012/730/original/Palm_Trees_07_-_4K_res.mp4"

          const placeHolderOne = "./assets/images/placeholder2.jpg";
          
          if(carNumber == 1) {
            caravanVideo.src = `${caravanVideoOne}` 
          } else if (carNumber == 2) {
            caravanImg.src = `${caravanImageTwo}`
          } else if (carNumber == 3) {
            caravanImg.src = `${caravanImageThree}`
          } else if (carNumber == 4) {
            caravanVideo.src = `${caravanVideoFour}`
          } else {
            caravanImg.src = `${placeHolderOne}`
          }

          //End Dynamically Add Image or Video to Popup//

          //Add highlight functionality//

          let result = hitResult.results[0].graphic;

          view.whenLayerView(result.layer).then((layerView) => {
              highlight?.remove();
              highlight = layerView.highlight(result, { name: "custom"});
          });

        } else {

          $('#city-card').fadeOut();
          $('#caravan-card').fadeOut();
          highlight?.remove();
          
        };
      })
    });

    /***End Start Popup HitTest Functionality***/

    /***Filter Functionality */

    let newValue;

    const filterSelect = document.getElementById("caravan-filter");
    const timelines = document.querySelectorAll('.timeline-container');
    const routes = document.querySelectorAll('.route-container');

    function zoomToLayer(layer) {
      return layer.queryExtent().then((response) => {
        let extent = response.extent.clone();

        // Expand the extent by a factor (e.g., 1.2 = zoom out slightly)
        extent = extent.expand(1.4); // Expand 20%
        view.goTo(
            {
              target: extent
            },
            {
              duration: 1500,
              easing: "linear"
          }).catch((error) => {
          console.error(error);
        });
      });
    }

    function setDefinition() {
      caravanStops.definitionExpression = `(CaravanNumber='${newValue}')`;
      caravanRoutes.definitionExpression = `(CarNum='${newValue}')`;
    }
        
    filterSelect.addEventListener("change", function(event) {
      newValue = event.target.value;
      //Remove active class from timeline 'li' elements
      lists.forEach((list) => list.classList.remove("active"));

      if (newValue != 0) {
        setDefinition();
        highlightSelect?.remove();
        zoomToLayer(caravanRoutes);
      } else {
        caravanStops.definitionExpression = null;
        caravanRoutes.definitionExpression = null;
        highlightSelect?.remove();
        view.goTo({
          position: {
            x: -97.3497654896104,
            y: 38.938391919294915,
            z: 7783963.6349063385
          },
          heading: 359.627264859108,
          tilt: 0.22518567955045343
        }, {
          duration: 1500,
          easing: "linear"
        });
      }

      //Show correct timeline after filter

      timelines.forEach((timeline, i) => {
        if (i === newValue - 1) {
          timeline.classList.add('show');
        } else {
          timeline.classList.remove('show');
        }
      });

      //Hide / Reveal Legend items after filter


      routes.forEach((route, i) => {
        if (newValue <= 0) {
          route.classList.remove('hide');
        } else if (i === newValue - 1) {
          route.classList.remove('hide');
        } else {
          route.classList.add('hide');
        }
      });
      
    });

    /***End Filter Functionality */

    /***Reset Filter Button***/

    const filterReset = document.getElementById('filter-reset-btn');

    filterReset.addEventListener('click', ()=> {
        filterSelect.selectedIndex = 0;
        caravanStops.definitionExpression = null;
        caravanRoutes.definitionExpression = null;
        highlightSelect?.remove();
        view.goTo({
          position: {
            x: -97.3497654896104,
            y: 38.938391919294915,
            z: 7783963.6349063385
          },
          heading: 359.627264859108,
          tilt: 0.22518567955045343
        }, {
          duration: 1500,
          easing: "linear"
        });

        timelines.forEach((timeline) => {
            timeline.classList.remove('show');
        });

        routes.forEach((route) => {
            route.classList.remove('hide');
        });
    });

    /***End Reset Filter Button***/

    /***Timeline Functionality***/

    let highlightSelect;
    const lists = document.querySelectorAll(".timeline li");

    map.when(() => {
      view.whenLayerView(caravanStops).then((layerView) => {
        const queryCities = caravanStops.createQuery();

        for (let i = 0, li = null; (li = lists[i]); i++) {
          li.addEventListener('click', onClick);
        }

        /*Timeline Highlight*/

        function onClick(event) {
            let target = event.target;

            const li = target.closest("li");
            if (!li) return;

            lists.forEach((list) => list.classList.remove("active"));
            li.classList.add("active");

            const firstSpan = li.querySelector("span:first-of-type");
            if (!firstSpan) return;

            const cityName = firstSpan.innerText;

            queryCities.where = `City='${cityName}' AND CaravanNumber = ${newValue}`;

            caravanStops.queryFeatures(queryCities).then((result) => {
              if (highlightSelect) {
                highlightSelect.remove();
              }

              const feature = result.features[0];

              highlightSelect = layerView.highlight(feature.attributes["OBJECTID"], {
                name: "custom"
              });

              view.goTo(
                {
                  target: feature.geometry,
                  tilt: 0,
                  zoom: 10
                },
                {
                  duration: 1250,
                  easing: "linear"
                }
              ).catch((error) => {
                if (error.name !== "AbortError") {
                  console.error(error);
                }
              });
            });
          };
        });
    });

    /***End Timeline Functionality***/

    /***Scale-based Renderer***/

    reactiveUtils.watch(
      () => view.scale,
      (scale) => {
        caravanRoutes.renderer = scale <= 4000000 ? routeRendererMedium : routeRendererLarge;
        caravanStops.renderer = scale >= 4000000 ? stopRendererSmall : stopRendererLarge;
        caravanStops.labelingInfo = scale <= 4000000 ? labelClass : null;
      }
    );

    /***End Scale-based Renderer***/

});