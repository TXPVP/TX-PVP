$(() => {
    let isCamOpen = false
    let isDroneOpen = false
    let cameraCount = 0
    let loadouts = {
        "DEA": [{ name: "shit", displayName: "trash" }, { name: "gsd", displayName: "dogAss" }],
        "NARCO": []
    }
    let routes = new Map()
    routes.set("spawnPointChooser", ({ target }) => {
            const pickedLoadout = $(`.loadoutSelect`).val();
            console.log(pickedLoadout)
        })
        // listen for nui messages
    window.addEventListener('message', (event) => {
        if (event.data.type === 'cameraVisible') {
            if (!event.data.value) {
                $(".cameraOverlay").hide()
                isCamOpen = false
            } else {
                isCamOpen = true
                cameraCount = event.data.count
                $(".location").text(`${event.data.location} (${event.data.index}/${cameraCount})`)
                $(".cameraOverlay").show()
            }
        }
        if (event.data.type === "setCamLocation") {
            $(".location").text(`${event.data.location} (${event.data.index}/${cameraCount})`)
        }
        if (event.data.type === "droneVisible") {
            if (event.data.value) {
                isDroneOpen = true
                $(".droneOverlay").fadeIn(500)
            } else {
                $(".droneOverlay").fadeOut(500)
            }
        }
        if (event.data.type === "setDroneProps") {
            $(".droneSpeed").text(`Air speed: ${(event.data.speed * 3.6).toFixed(2)} km/h`)
            $(".windSpeed").text(`Wind speed: ${(event.data.wSpeed * 3.6).toFixed(2)} km/h`)
            $(".droneHeight").text(`Height: ${event.data.height.toFixed(2)} m`)
            $(".droneHealth").text(`Health: ${event.data.health.toFixed(2)}%`)
            if (event.data.health > 90) {
                $(".statusImg").attr("src", "img/health_100.png")
            } else if (event.data.health <= 90 && event.data.health >= 70) {
                $(".statusImg").attr("src", "img/health_60.png")
            } else if (event.data.health <= 70 && event.data.health >= 40) {
                $(".statusImg").attr("src", "img/health_40.png")
            } else if (event.data.health < 40) {
                $(".statusImg").attr("src", "img/health_low.png")
            }
        }

        if (event.data.type === "chooseTeam") {
            $(".chooseTeam").show()
        }
    });
    $(".teamBtn").click(({ target }) => {
        const chosen = $(target).attr("team") // get custom team attribute
        $(".loadoutSelect").empty()
        loadouts[chosen].forEach((ld) => {
            $(".loadoutSelect").append(`<option value=${ld.name}>${ld.displayName}</option>`) // build selector box
        })
        $(".loadout").show()
    })

    $(".proceed").click((event) => {
            const destination = $(event.target).attr("to")
            routes.get(destination)(event)
        })
        // cunt
})