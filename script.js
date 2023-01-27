const d = document;
const $shows = d.querySelector(".shows");
const $input = d.getElementById("search-text");
const $template = d.getElementById("tShow").content;
const $fragment = d.createDocumentFragment();

const loadFragment = (shows) => {
    $shows.innerHTML = "";

    shows.forEach(el => {
        $template.querySelector("img").src = el.show.image ? el.show.image.medium 
        : "http://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
        $template.querySelector("img").alt = el.show.name;
        $template.querySelector("img").classList.add("cover")
        
        $template.querySelector("h3").textContent = el.show.name;
        $template.querySelector("h3").classList.add("name")
        
        let generos = "";
        if(el.show.genres.length === 0) generos = "---"
        el.show.genres.forEach(genre => {
            generos += `${genre}, `;
        })
        $template.querySelector("p").textContent = generos.slice(0, -2);
        $template.querySelector("p").classList.add("genres")

        $template.querySelector("div").innerHTML = el.show.summary ? el.show.summary : `<p>Sin descripcion..</p>`;
        $template.querySelector("div").classList.add("summary-box");
        $template.querySelector("div").firstElementChild.classList.add("summary")

        $template.querySelector("h4").textContent = el.show.rating.average ? `${el.show.rating.average}/10` : `--/10`;
        $template.querySelector("h4").classList.add("rating");
        
        let $clone = d.importNode($template,true)
        $fragment.appendChild($clone);
    });
    $shows.appendChild($fragment);
}

d.addEventListener("keypress", async e => {
    if((e.key === "Enter") && (d.activeElement === $input)){
        try {
            let API = `https://api.tvmaze.com/search/shows?q=${$input.value.toLowerCase()}`
            let res = await fetch(API);
            let shows = await res.json();
            //console.log(json)
            
            if(!res.ok) throw {status: res.status, statusText: res.statusText};
            
            if((shows.length === 0) && ($input.value === "")) $shows.innerHTML = `<h2 class="error" >Debe ingresar un criterio de busqueda</h2>`;
            
            else if(shows.length === 0) $shows.innerHTML = `<h2 class="error" >No se encontraron resultados para: <mark> ${$input.value} </mark></h2>`;
            
            else if($input.value !== 0) loadFragment(shows);

        } catch (err) {
            let msg = err.statusText || "Ocurrio un error script";
            $shows.innerHTML = `<p>Error ${err.status}: ${msg}</p>`;
        }
    }
})
