/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hammer, Sword, Gem, Pickaxe, Wand2, Zap, Twitch, MessageSquare, ExternalLink, Info, Table as TableIcon, TrendingUp, AlertTriangle } from 'lucide-react';

// --- Dados do Banco de Dados Embutido ---
const CRAFT_ITEMS = [
  {
    category: "Gemas Gigantes",
    icon: <Gem className="w-5 h-5" />,
    items: [
      { name: "Giant Ruby", multiplier: 2, req: "10 Small Rubys" },
      { name: "Giant Emerald", multiplier: 2, req: "10 Small Emeralds" },
      { name: "Giant Sapphire", multiplier: 2, req: "10 Small Sapphires" },
      { name: "Giant Amethyst", multiplier: 2, req: "10 Small Amethysts" },
    ]
  },
  {
    category: "Ferramentas & Picks",
    icon: <Pickaxe className="w-5 h-5" />,
    items: [
      { name: "Modified Pick", multiplier: 2, req: "1 Pick + 5 Steels" },
      { name: "Advanced Pick", multiplier: 1.5, req: "1 Pick + 10 Steels" },
      { name: "Enhanced Pick", multiplier: 1, req: "1 Pick + 20 Steels" },
      { name: "Diamon Knife", multiplier: 1, req: "10 small diamonds + 5 Hell Steels + 1 Combat Knife" },
    ]
  },
  {
    category: "Rods",
    icon: <Wand2 className="w-5 h-5" />,
    items: [
      { name: "Reinforced Rod", multiplier: 2, req: "1 fishing rod + 5 steels" },
      { name: "Engineered Rod", multiplier: 1.5, req: "1 fishing rod + 10 steels + 1 draconian steel" },
      { name: "Volcanic Rod", multiplier: 1, req: "1 fishing rod + 20 steels + 10 glimmering soils + 5 draconian steels + 3 hell steels" },
      { name: "Golden Rod", multiplier: 0.5, req: "1 fishing rod + 40 steels + 10 draconian steels + 3 gold ingot + 3 hell steels" },
    ]
  },
  {
    category: "Runas de Crafting",
    icon: <Zap className="w-5 h-5" />,
    items: [
      { name: "Ember Rune", multiplier: 1, req: "5 Ember Fragments + 3 Pulverized Ores + 1 Onyx" },
      { name: "Protector Rune", multiplier: 1, req: "5 Protector Fragments + 3 Pulverized Ores + 1 Onyx" },
      { name: "Obsidian Rune", multiplier: 1, req: "5 Protector Fragments + 3 Pulverized Ores + 1 Onyx" },
      { name: "Astral Rune", multiplier: 1, req: "5 Astral Fragments + 3 Pulverized Ores + 1 Onyx" },
      { name: "Aegis Rune", multiplier: 1, req: "5 Aegis Fragments + 3 Pulverized Ores + 1 Onyx" },
      { name: "Molten Rune", multiplier: 1, req: "5 Molten Fragments + 3 Pulverized Ores + 1 Onyx" },
    ]
  },
  {
    category: "Outros",
    icon: <Sword className="w-5 h-5" />,
    items: [
      { name: "Fiery Stone", multiplier: 0.5, req: "5 Glimmering Soils" },
      { name: "10x Steel Bolts", multiplier: 1.2, req: "10 bolt + 1 steel + 1x Natural Soil" },
    ]
  }
];

const BREAKING_DATA = [
  { item: "Short Sword", max: 1, min: 0, mathAvg: "0.5 Steels", practicalAvg: "0.27 Steels", verdict: "Vender NPC ou UPAR SKILL" },
  { item: "Sword", max: 2, min: 0, mathAvg: "1 Steel", practicalAvg: "1.00 Steel", verdict: "Vender NPC" },
  { item: "Plate Shield", max: 3, min: 0, mathAvg: "1.5 Steels", practicalAvg: "1.52 Steels", verdict: "Vender NPC" },
  { item: "Dwarven Shield", max: 8, min: 0, mathAvg: "4 Steels", practicalAvg: "4.35 Steels", verdict: "QUEBRAR PARA MATERIAL" },
  { item: "Studded Armor", max: 1, min: 0, mathAvg: "1 Steel", practicalAvg: "0.47 Steels", verdict: "UPAR SKILL" },
  { item: "Chain Armor", max: 5, min: 0, mathAvg: "2.5 Steels", practicalAvg: "2.60 Steels", verdict: "Vender NPC OU COLETAR MAT RAPIDO" },
  { item: "Mace", max: 2, min: 0, mathAvg: "1 Steel", practicalAvg: "1.10 Steels", verdict: "Vender NPC" },
  { item: "Longsword", max: 4, min: 0, mathAvg: "2 Steels", practicalAvg: "1.85 Steels", verdict: "Vender NPC" },
  { item: "Chain Helmet", max: 1, min: 0, mathAvg: "0.5 Steel", practicalAvg: "0.50 Steels", verdict: "UPAR SKILL" },
  { item: "Steel Shield", max: 6, min: 0, mathAvg: "3 Steels", practicalAvg: "2.90 Steels", verdict: "Vender NPC OU COLETAR MAT RAPIDO" },
  { item: "Scale Armor", max: 8, min: 0, mathAvg: "4 Steels", practicalAvg: "3.57 Steels", verdict: "QUEBRAR" },
  { item: "Wooden Shield", max: 1, min: 0, mathAvg: "0.5 Steels", practicalAvg: "0.30 Steels", verdict: "UPAR SKILL" },
  { item: "Hand Axe", max: 1, min: 0, mathAvg: "0.5 Steels", practicalAvg: "0.30 Steels", verdict: "UPAR SKILL" },
  { item: "Axe", max: 1, min: 0, mathAvg: "0.5 Steels", practicalAvg: "0.32 Steels", verdict: "UPAR SKILL" },
];

export default function App() {
  const [skill, setSkill] = useState<number>(10);
  const [selectedItemName, setSelectedItemName] = useState<string>(CRAFT_ITEMS[0].items[0].name);
  const [chance, setChance] = useState<number>(10);

  // Encontra o item selecionado para pegar o multiplicador e requisitos
  const selectedItem = useMemo(() => {
    for (const cat of CRAFT_ITEMS) {
      const item = cat.items.find(i => i.name === selectedItemName);
      if (item) return item;
    }
    return CRAFT_ITEMS[0].items[0];
  }, [selectedItemName]);

  // Lógica Matemática: Chance = 10% + ((Skill - 10) * Multiplicador / 100)
  useEffect(() => {
    const calcChance = 10 + ((skill - 10) * selectedItem.multiplier);
    // Regra de Trava: Máximo 100%
    setChance(Math.min(100, Math.max(0, calcChance)));
  }, [skill, selectedItem]);

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Cabeçalho */}
      <header className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-2"
        >
          <Hammer className="text-medieval-gold w-8 h-8 sm:w-10 sm:h-10" />
          <h1 className="text-3xl sm:text-4xl font-black text-medieval-gold uppercase tracking-tighter">
            Calculadora de Crafting
          </h1>
        </motion.div>
        <p className="text-medieval-gold/80 font-mono text-sm sm:text-base">
          Miracle 7.4 — Criado por <span className="text-medieval-gold font-bold">obellao_</span>
        </p>
      </header>

      <main className="w-full max-w-6xl space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Área de Interação (Centro) */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="medieval-card bg-medieval-card p-6 sm:p-8 medieval-border rounded-lg"
            >
              <div className="space-y-6">
                {/* Input de Skill */}
                <div className="flex flex-col gap-2">
                  <label className="text-medieval-gold font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Sua Skill Atual
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="200"
                    value={skill}
                    onChange={(e) => setSkill(Number(e.target.value))}
                    className="medieval-input text-2xl font-bold"
                  />
                </div>

                {/* Select de Item */}
                <div className="flex flex-col gap-2">
                  <label className="text-medieval-gold font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                    <Hammer className="w-4 h-4" /> Item a ser Craftado
                  </label>
                  <select
                    value={selectedItemName}
                    onChange={(e) => setSelectedItemName(e.target.value)}
                    className="medieval-input cursor-pointer appearance-none"
                  >
                    {CRAFT_ITEMS.map((category) => (
                      <optgroup key={category.category} label={category.category} className="bg-medieval-dark text-medieval-gold">
                        {category.items.map((item) => (
                          <option key={item.name} value={item.name}>
                            {item.name} (Mult: {item.multiplier})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* Requisitos do Item */}
                {selectedItem.req && (
                  <div className="bg-black/40 p-4 rounded border border-medieval-gold/20 flex items-start gap-3">
                    <Info className="w-5 h-5 text-medieval-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs uppercase text-medieval-gold/60 font-bold tracking-tighter">Requisitos:</p>
                      <p className="text-sm text-medieval-text italic">{selectedItem.req}</p>
                    </div>
                  </div>
                )}

                {/* Resultado */}
                <div className="pt-6 border-t border-medieval-gold/20">
                  <div className="text-center space-y-2">
                    <p className="text-medieval-gold/60 uppercase text-xs font-bold tracking-[0.2em]">Chance de Sucesso</p>
                    <motion.div 
                      key={chance}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`text-6xl sm:text-7xl font-black ${chance >= 70 ? 'text-green-500' : chance >= 40 ? 'text-medieval-gold' : 'text-medieval-red'}`}
                    >
                      {chance}%
                    </motion.div>
                    
                    {/* Barra de Progresso Visual */}
                    <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden border border-medieval-gold/30 mt-4">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${chance}%` }}
                        transition={{ type: "spring", stiffness: 50 }}
                        className={`h-full ${chance >= 70 ? 'bg-green-500' : chance >= 40 ? 'bg-medieval-gold' : 'bg-medieval-red'}`}
                        style={{ boxShadow: `0 0 10px ${chance >= 70 ? '#22c55e' : chance >= 40 ? '#d4af37' : '#8b0000'}` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Área do Criador (Lateral) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Twitch Player */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="medieval-border rounded-lg overflow-hidden bg-black aspect-video"
            >
              <iframe
                src={`https://player.twitch.tv/?channel=obellao_&parent=${window.location.hostname}`}
                height="100%"
                width="100%"
                allowFullScreen
                title="Twitch Player"
              />
            </motion.div>

            {/* Call to Actions */}
            <div className="grid grid-cols-1 gap-4">
              <a 
                href="https://www.twitch.tv/obellao_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="medieval-button flex items-center justify-center gap-3 group"
              >
                <Twitch className="w-6 h-6 group-hover:animate-bounce" />
                Me acompanhe na Twitch
                <ExternalLink className="w-4 h-4 opacity-50" />
              </a>

              <a 
                href="https://discord.gg/nacCypRkqQ" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 px-6 rounded-sm transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-3 border border-white/20 shadow-lg"
              >
                <MessageSquare className="w-6 h-6" />
                Entre no nosso Discord
                <ExternalLink className="w-4 h-4 opacity-50" />
              </a>
            </div>

            {/* Footer Info */}
            <div className="text-center lg:text-left text-medieval-gold/40 text-[10px] uppercase tracking-widest font-mono">
              <p>© 2024 Miracle 7.4 Crafting System</p>
              <p>Fórmula: 10% + ((Skill - 10) * Mult / 100)</p>
            </div>
          </div>
        </div>

        {/* --- Nova Tabela de Quebra de Itens --- */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full space-y-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <TableIcon className="text-medieval-gold w-6 h-6" />
            <h2 className="text-2xl font-black text-medieval-gold uppercase tracking-tight">Guia de Quebra de Itens (Scrapping)</h2>
          </div>

          <div className="medieval-border rounded-lg overflow-hidden bg-medieval-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/60 text-medieval-gold uppercase text-xs tracking-widest border-b border-medieval-gold/30">
                    <th className="p-4 font-black">Item</th>
                    <th className="p-4 font-black text-center">Máx</th>
                    <th className="p-4 font-black text-center">Mín</th>
                    <th className="p-4 font-black">Média Mat.</th>
                    <th className="p-4 font-black">Média Prática</th>
                    <th className="p-4 font-black">Veredito</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {BREAKING_DATA.map((row, idx) => (
                    <tr 
                      key={idx} 
                      className={`border-b border-medieval-gold/10 hover:bg-white/5 transition-colors ${idx % 2 === 0 ? 'bg-black/20' : ''}`}
                    >
                      <td className="p-4 font-bold text-medieval-gold">{row.item}</td>
                      <td className="p-4 text-center">{row.max}</td>
                      <td className="p-4 text-center">{row.min}</td>
                      <td className="p-4 text-medieval-text/80">{row.mathAvg}</td>
                      <td className="p-4 font-mono text-medieval-gold/90">{row.practicalAvg}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-sm text-[10px] font-black uppercase tracking-tighter ${
                          row.verdict.includes('QUEBRAR') ? 'bg-green-900/50 text-green-400 border border-green-500/30' :
                          row.verdict.includes('UPAR') ? 'bg-blue-900/50 text-blue-400 border border-blue-500/30' :
                          'bg-medieval-red/20 text-medieval-red border border-medieval-red/30'
                        }`}>
                          {row.verdict}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-medieval-red/10 border border-medieval-red/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-medieval-red shrink-0 mt-0.5" />
            <p className="text-xs text-medieval-text/70 italic">
              * Os dados de "Média Prática" são baseados em testes reais realizados in-game. Os resultados podem variar dependendo da sua sorte (RNG).
            </p>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
