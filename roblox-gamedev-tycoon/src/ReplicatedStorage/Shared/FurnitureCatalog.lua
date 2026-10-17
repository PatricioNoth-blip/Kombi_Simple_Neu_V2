--!strict
-- Möbelkatalog für das Game-Dev-Tycoon.
-- Preise werden NICHT von Hand gesetzt, sondern aus den Vorteilen berechnet:
-- Wert = Summe(Gewicht * Bonus), Preis = PRICE_SCALE * Wert ^ PRICE_EXPONENT.
-- Wer mehr bringt, kostet überproportional mehr. Alles Balancing liegt oben in diesem Modul.

local FurnitureCatalog = {}

export type Effects = {
	seats: number?, -- Arbeitsplätze (ein Mitarbeiter pro Platz)
	codeSpeed: number?, -- % schnellere Programmierung
	designSpeed: number?, -- % schnelleres Design
	soundSpeed: number?, -- % schnellerer Sound
	allSpeed: number?, -- % auf alle drei Bereiche
	bugReduction: number?, -- % weniger Bugs im fertigen Spiel
	morale: number?, -- Moral-Punkte
	research: number?, -- % mehr Forschungspunkte
	fame: number?, -- Ruhm pro Tag
}

export type Item = {
	id: string,
	name: string,
	category: string,
	size: { number }, -- {Breite, Tiefe} in Grid-Zellen
	unlockTier: number, -- 1 = Garage, 2 = Keller, 3 = Büro, 4 = Großraumbüro, 5 = Studio
	maxCount: number, -- wie oft man es platzieren darf
	effects: Effects,
	price: number?, -- wird unten berechnet
}

-- Wie viel ein Bonuspunkt wert ist. Hier steuerst du, was dir Vorteile "kosten".
FurnitureCatalog.STAT_WEIGHTS = {
	seats = 15,
	codeSpeed = 4,
	designSpeed = 4,
	soundSpeed = 4,
	allSpeed = 10, -- wirkt auf drei Bereiche, deshalb mehr als ein Einzelwert
	bugReduction = 5,
	morale = 6,
	research = 5,
	fame = 12,
}

-- Obergrenzen für die Summe aller Möbel, damit man nicht endlos stapeln kann.
FurnitureCatalog.STAT_CAPS = {
	codeSpeed = 150,
	designSpeed = 150,
	soundSpeed = 150,
	allSpeed = 40,
	bugReduction = 60,
	morale = 100,
	research = 100,
	fame = 50,
}

FurnitureCatalog.PRICE_SCALE = 3
FurnitureCatalog.PRICE_EXPONENT = 1.2
-- Jedes weitere gleiche Möbelstück bringt nur noch diesen Anteil des vorherigen.
FurnitureCatalog.STACK_FALLOFF = 0.6

FurnitureCatalog.TIER_NAMES = { "Garage", "Keller", "Büro", "Großraumbüro", "Studio" }

local function item(id: string, name: string, category: string, size: { number }, unlockTier: number, maxCount: number, effects: Effects): Item
	return {
		id = id,
		name = name,
		category = category,
		size = size,
		unlockTier = unlockTier,
		maxCount = maxCount,
		effects = effects,
	}
end

local ITEMS: { Item } = {
	-- Arbeitsplätze
	item("folding_table", "Klapptisch", "Arbeitsplatz", { 2, 1 }, 1, 6, { seats = 1 }),
	item("wood_desk", "Holz-Schreibtisch", "Arbeitsplatz", { 2, 1 }, 1, 8, { seats = 1, allSpeed = 2 }),
	item("standing_desk", "Höhenverstellbarer Tisch", "Arbeitsplatz", { 2, 1 }, 2, 10, { seats = 1, allSpeed = 5, morale = 3 }),
	item("dual_monitor", "Dual-Monitor-Arbeitsplatz", "Arbeitsplatz", { 2, 1 }, 3, 12, { seats = 1, codeSpeed = 12, designSpeed = 6 }),
	item("workstation_pro", "Workstation Pro", "Arbeitsplatz", { 2, 2 }, 4, 12, { seats = 1, codeSpeed = 20, designSpeed = 20, soundSpeed = 10 }),

	-- Stühle
	item("folding_chair", "Klappstuhl", "Stuhl", { 1, 1 }, 1, 6, { morale = 1 }),
	item("office_chair", "Bürostuhl", "Stuhl", { 1, 1 }, 2, 12, { allSpeed = 1, morale = 3 }),
	item("ergo_chair", "Ergonomischer Stuhl", "Stuhl", { 1, 1 }, 3, 12, { allSpeed = 3, morale = 6, bugReduction = 2 }),
	item("gaming_chair", "Gaming-Stuhl", "Stuhl", { 1, 1 }, 4, 12, { morale = 8, designSpeed = 4, fame = 1 }),

	-- Technik
	item("test_laptop", "Gebrauchter Test-Laptop", "Technik", { 1, 1 }, 1, 3, { bugReduction = 5 }),
	item("device_wall", "Testgeräte-Wand", "Technik", { 2, 1 }, 3, 2, { bugReduction = 15 }),
	item("server_rack", "Server-Rack", "Technik", { 1, 2 }, 3, 3, { codeSpeed = 8, allSpeed = 3 }),
	item("graphics_tablet", "Grafiktablett-Ecke", "Technik", { 1, 1 }, 2, 4, { designSpeed = 12 }),
	item("mic_booth", "Mikrofon-Ecke", "Technik", { 2, 1 }, 2, 3, { soundSpeed = 15 }),
	item("synth_setup", "Synthesizer-Setup", "Technik", { 2, 1 }, 4, 3, { soundSpeed = 25, fame = 2 }),

	-- Komfort
	item("plant", "Zimmerpflanze", "Komfort", { 1, 1 }, 1, 6, { morale = 2 }),
	item("coffee_machine", "Kaffeemaschine", "Komfort", { 1, 1 }, 1, 3, { morale = 5, allSpeed = 2 }),
	item("mini_fridge", "Mini-Kühlschrank", "Komfort", { 1, 1 }, 1, 2, { morale = 4 }),
	item("sofa", "Sofa", "Komfort", { 2, 1 }, 2, 3, { morale = 7 }),
	item("aircon", "Klimaanlage", "Komfort", { 1, 1 }, 3, 2, { morale = 6, allSpeed = 2 }),
	item("kicker", "Kickertisch", "Komfort", { 2, 1 }, 3, 2, { morale = 10, fame = 1 }),

	-- Wissen
	item("bookshelf", "Bücherregal", "Wissen", { 1, 1 }, 1, 4, { research = 5 }),
	item("whiteboard", "Whiteboard", "Wissen", { 2, 1 }, 2, 3, { allSpeed = 3, bugReduction = 3 }),
	item("research_bench", "Forschungs-Labortisch", "Wissen", { 2, 1 }, 4, 3, { research = 15 }),

	-- Ruhm
	item("poster", "Retro-Poster", "Ruhm", { 1, 1 }, 1, 8, { fame = 1, morale = 1 }),
	item("trophy_case", "Pokal-Vitrine", "Ruhm", { 1, 1 }, 3, 3, { fame = 4 }),
}

local function niceRound(price: number): number
	-- auf zwei gültige Stellen runden: 77 -> 77, 1923 -> 1900
	local magnitude = 10 ^ (math.floor(math.log10(price)) - 1)
	return math.max(1, math.floor(price / magnitude + 0.5) * magnitude)
end

function FurnitureCatalog.valueOf(effects: Effects): number
	local value = 0
	for stat, amount in effects :: any do
		value += (FurnitureCatalog.STAT_WEIGHTS :: any)[stat] * amount
	end
	return value
end

function FurnitureCatalog.priceOf(effects: Effects): number
	return niceRound(FurnitureCatalog.PRICE_SCALE * FurnitureCatalog.valueOf(effects) ^ FurnitureCatalog.PRICE_EXPONENT)
end

FurnitureCatalog.items = {} :: { [string]: Item }
FurnitureCatalog.list = ITEMS

for _, entry in ITEMS do
	entry.price = FurnitureCatalog.priceOf(entry.effects)
	FurnitureCatalog.items[entry.id] = entry
end

-- Summe aller Boni für einen Bestand, z. B. { wood_desk = 3, plant = 2 }.
-- Arbeitsplätze zählen voll, alle anderen Boni nehmen pro gleichem Möbelstück ab.
function FurnitureCatalog.totalEffects(placed: { [string]: number }): { [string]: number }
	local totals: { [string]: number } = {}
	for id, count in placed do
		local entry = FurnitureCatalog.items[id]
		if entry then
			local n = math.min(count, entry.maxCount)
			local stackFactor = 0
			for k = 0, n - 1 do
				stackFactor += FurnitureCatalog.STACK_FALLOFF ^ k
			end
			for stat, amount in entry.effects :: any do
				local factor = if stat == "seats" then n else stackFactor
				totals[stat] = (totals[stat] or 0) + amount * factor
			end
		end
	end
	for stat, cap in FurnitureCatalog.STAT_CAPS do
		if totals[stat] and totals[stat] > cap then
			totals[stat] = cap
		end
	end
	return totals
end

function FurnitureCatalog.availableIn(tier: number): { Item }
	local result = {}
	for _, entry in ITEMS do
		if entry.unlockTier <= tier then
			table.insert(result, entry)
		end
	end
	return result
end

return FurnitureCatalog
