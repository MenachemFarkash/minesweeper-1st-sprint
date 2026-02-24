function initSeed() {
    let playerSeed = document.querySelector(`.seed-input`).value
    if (playerSeed) {
        setSeed(playerSeed)
    } else {
        setSeed(Date.now())
    }
    document.querySelector(".seed-modal-container").classList.add("hidden")
}

function setSeed(seed) {
    gSeed = seed
}

function seededRandom() {
    const A = 1664525
    const C = 1013904223
    const M = 2 ** 32

    gSeed = (A * gSeed + C) % M
    return gSeed / M
}
