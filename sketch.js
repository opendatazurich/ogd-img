var presets = {
	custom: "500x500",
	powerpoint: "1440x1080",
	"1080p": "1920x1080",
	cmsSitePortrait: "80x120",
	cmsSiteSquare: "80x80",
	kontextbox: "211x120",
	cmsImgLarge: "332x249",
	cmsImgSmall: "180x135",
	blogBanner: "516x250"
}


document.addEventListener('DOMContentLoaded', (e) => {
	document.querySelector("#layers-select").style.height = (window.innerHeight - 220) + "px"
	document.querySelector("#resize").addEventListener("click", updateSize)

})

var cnv = undefined

var imgs = []

function setup() {
	cnv = createCanvas(500, 500)
	cnv.parent('canvas')
	updateSize()
	background(194, 211, 239)
	cnv.drop(gotFile);

	Object.keys(presets).forEach(d => {
			d3.select("#format").append("option").property("value", presets[d]).text(d)
	})

	d3.select("#format").on("change", () => {
		var size = document.querySelector("#format").value.split("x")

		document.querySelector("#size-x").value = size[0]
		document.querySelector("#size-y").value = size[1]
	})




	d3.selectAll("#export button").on("click", () => {
		saveCanvas('ogd-img_'+new Date().toISOString().split(".")[0], d3.event.target.id);
	})

}

function draw() {
	background(194, 211, 239)

	imgs.forEach((img, i) => {
		var settings = d3.select("#img-"+i).select(".img-settings")
			push()
			img.x = +settings.select(".is-x").property("value")
			img.y = +settings.select(".is-y").property("value")
			img.scale = +settings.select(".is-scale").property("value")
			img.opacity = +settings.select(".is-opacity").property("value")

			translate(img.x,img.y)
			scale(img.scale*.01)
			tint(255, img.opacity*2.56);
			image(img.img, 0, 0);
			pop()
	})
	noLoop()
}

function cover(e) {
	var imgContainer = d3.select(d3.event.target.parentElement.parentElement)

	var i = imgContainer.attr("id").split("-")[1]
	// console.log(e.target)
	var x = (document.querySelector("#size-x").value/imgs[i].img.width)
	var y = (document.querySelector("#size-y").value/imgs[i].img.height)


	if(x<y){
		imgContainer.select(".is-scale").property("value", Math.ceil(y*100))
	} else {
		imgContainer.select(".is-scale").property("value", Math.ceil(x*100))
	}
	redraw()
}

function fit(e) {
	var imgContainer = d3.select(d3.event.target.parentElement.parentElement)

	var i = imgContainer.attr("id").split("-")[1]
	// console.log(e.target)
	var x = (document.querySelector("#size-x").value/imgs[i].img.width)
	var y = (document.querySelector("#size-y").value/imgs[i].img.height)


	if(x>y){
		imgContainer.select(".is-scale").property("value", Math.ceil(y*100))
	} else {
		imgContainer.select(".is-scale").property("value", Math.ceil(x*100))
	}
	redraw()
}

function position(pos){
	var imgContainer = d3.select(d3.event.target.parentElement.parentElement)
	var i = imgContainer.attr("id").split("-")[1]

	switch(pos){
		case "l":
			imgContainer.select(".is-x").property("value", 0)
			break
		case "t":
			imgContainer.select(".is-y").property("value", 0)
			break
		case "r":
			imgContainer.select(".is-x").property("value", document.querySelector("#size-x").value - imgs[i].img.width*imgContainer.select(".is-scale").property("value")*.01)
			break
		case "b":
			imgContainer.select(".is-y").property("value", document.querySelector("#size-y").value - imgs[i].img.height*imgContainer.select(".is-scale").property("value")*.01)
		break
		case "c":
			imgContainer.select(".is-x").property("value", (document.querySelector("#size-x").value - imgs[i].img.width*imgContainer.select(".is-scale").property("value")*.01)*.5)
			imgContainer.select(".is-y").property("value", (document.querySelector("#size-y").value - imgs[i].img.height*imgContainer.select(".is-scale").property("value")*.01)*.5)
		break
	}
	redraw()
}

function del(){
	var imgContainer = d3.select(d3.event.target.parentElement.parentElement)
	var i = imgContainer.attr("id").split("-")[1]

	imgs.splice(i,1)
	d3.select("#img-"+imgs.length).remove()

	// d3.select("#layers-select").empty()

	updateLayers()
}

function up(){
	var imgContainer = d3.select(d3.event.target.parentElement.parentElement)
	var i = +imgContainer.attr("id").split("-")[1]

	if(i >= imgs.length-1)
		return

	var temp = imgs[i+1]
	imgs[i+1] = imgs[i]
	imgs[i] = temp

	updateLayers()
}


function down(){
	var imgContainer = d3.select(d3.event.target.parentElement.parentElement)
	var i = +imgContainer.attr("id").split("-")[1]

	if(i === 0)
		return

	var temp = imgs[i-1]
	imgs[i-1] = imgs[i]
	imgs[i] = temp

	updateLayers()
}

function updateLayers(){
	imgs.forEach((img, i) => {
		var imgContainer = d3.select("#img-"+i)
		imgContainer.select(".image").style("background-image", "url(" + img.data + ")")
		imgContainer.select(".is-x").property("value", img.x)
		imgContainer.select(".is-y").property("value", img.y)
		imgContainer.select(".is-scale").property("value", img.scale)
		imgContainer.select(".is-opacity").property("value", img.opacity)
	})
	redraw()
}

function gotFile(file) {
	if (file.type === 'image') {

		var imgContainer = d3.select("#layers-select").append("div")
			.attr("id", "img-" + imgs.length)
			.attr("class", "img-container")

		imgContainer.append("div").attr("class", "image").style("background-image", "url(" + file.data + ")")
		imgContainer.append("div").attr("class", "img-settings").html('x: <input class="is-x" type="text" value="0">px<br>y: <input class="is-y" type="text" value="0">px<br>scale: <input type="text" class="is-scale" value="100">%<br>opacity: <input type="text" class="is-opacity" value="100">%<br><button class="is-cover button3">cover</button><button class="is-fit button3">fit</button><button class="is-delete button3">delete</button><br><button class="is-l mini">L</button><button class="is-r mini">R</button><button class="is-c mini">C</button><button class="is-t mini">T</button><button class="is-b mini">B</button><br><button class="is-up">up</button><button class="is-down">down</button>')
		imgs.push({
			img: loadImage(file.data, redraw),
			data: file.data,
			x: 0,
			y: 0,
			opacity: imgs.length ? 50 : 100,
			scale: 100
		})

		imgContainer.select(".is-opacity").property("value", imgs[imgs.length-1].opacity)

		imgContainer.select(".is-cover").on("click", cover)
		imgContainer.select(".is-fit").on("click", fit)
		imgContainer.select(".is-delete").on("click", del)
		imgContainer.select(".is-up").on("click", up)
		imgContainer.select(".is-down").on("click", down)
		imgContainer.select(".is-l").on("click", () => position("l"))
		imgContainer.select(".is-r").on("click", () => position("r"))
		imgContainer.select(".is-c").on("click", () => position("c"))
		imgContainer.select(".is-t").on("click", () => position("t"))
		imgContainer.select(".is-b").on("click", () => position("b"))
		imgContainer.selectAll("input").on("blur", redraw)

	} else {
		println('Not an image file!');
	}
}

function updateSize() {
	resizeCanvas(document.querySelector("#size-x").value, document.querySelector("#size-y").value)
	var x = ((windowWidth - 250) - width) / 2
	var y = (windowHeight - height) / 2
	x = x > 0 ? x : 0
	y = y > 0 ? y : 0
	cnv.position(x, y);
}
