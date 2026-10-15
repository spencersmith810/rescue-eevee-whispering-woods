// The browser version of provept2.py. Story nodes replace nested Python if blocks.
const supplies = [
  { id: 'rope', icon: '🪢', name: 'Rope', detail: 'A little help for hard-to-reach places.' },
  { id: 'berry', icon: '🍒', name: 'Berry', detail: 'A sweet treat for a friend in need.' },
  { id: 'knife', icon: '🔪', name: 'Knife', detail: 'A useful tool for tangled trails.' }
];
const partners = [
  { id: 'pikachu', icon: 'ϟ', name: 'Pikachu', detail: 'An electric friend. Follow the river.' },
  { id: 'charmander', icon: '🔥', name: 'Charmander', detail: 'A warm heart. Explore the hillside.' },
  { id: 'bulbasaur', icon: '🌱', name: 'Bulbasaur', detail: 'A gentle soul. Search the undergrowth.' }
];
// Each choice leads to another scene or an ending. Some require a packed item.
const story = {
  pikachu: { place: 'The river crossing', title: 'A river runs through it.', text: 'Pikachu’s ears perk up. Across the rushing river, you hear a tiny cry. Stepping stones lead into the water, and a quiet path follows the bank.', choices: [ ['Cross the stepping stones', 'Take a careful step into the river.', 'island'], ['Follow the riverbank', 'See where the winding path leads.', 'psyduck'] ] },
  island: { place: 'A small river island', title: 'So close, yet so far.', text: 'There’s Eevee! It’s stranded on a small island, watching the water nervously. How will you help it across?', choices: [ ['Build a bridge', 'Give Eevee a safe path to shore.', 'build'], ['Call to Eevee', 'Encourage it to make the jump.', 'call'] ] },
  psyduck: { place: 'The winding riverbank', title: 'An unexpected roadblock.', text: 'A nervous Psyduck blocks the trail to Eevee. A little patience—or a little snack—might help.', choices: [ ['Offer a berry', 'Make a grateful new friend.', 'offer', 'berry'], ['Wait patiently', 'Give Psyduck the space it needs.', 'wait'] ] },
  charmander: { place: 'The rocky hillside', title: 'A light in the darkness.', text: 'Charmander’s tail lights up a cave entrance. From somewhere nearby, you hear Eevee. You could head inside, or climb the hill for a better view.', choices: [ ['Enter the cave', 'Let Charmander light the way.', 'cave'], ['Climb the hill', 'Look for Eevee from above.', 'ledge'] ] },
  cave: { place: 'Inside the quiet cave', title: 'Let sleeping Onix lie?', text: 'Eevee is hiding behind a sleeping Onix. Every rumbling snore echoes off the walls. You and Charmander exchange a look.', choices: [ ['Sneak past Onix', 'Keep your footsteps feather-light.', 'sneak'], ['Distract Onix', 'Get its attention away from Eevee.', 'distract'] ] },
  ledge: { place: 'The narrow ledge', title: 'A friend on the edge.', text: 'Eevee balances on a narrow ledge below you. A rope could bring it safely up, but there might be another way around.', choices: [ ['Lower your rope', 'Help Eevee climb up to safety.', 'lower', 'rope'], ['Find another route', 'Search for a hidden trail.', 'find'] ] },
  bulbasaur: { place: 'The leafy undergrowth', title: 'Little paws. A big clue.', text: 'Bulbasaur discovers tiny tracks beside some thick bushes. The footprints lead deeper into the woods, but you hear rustling in the leaves.', choices: [ ['Track the footprints', 'Follow Eevee’s trail.', 'branch'], ['Search the bushes', 'Find out what’s hiding nearby.', 'vines'] ] },
  branch: { place: 'The fallen branch', title: 'A helping hand. Or vine.', text: 'You found Eevee! Its paw is caught beneath a fallen branch. Bulbasaur stands ready beside you.', choices: [ ['Lift the branch', 'Roll up your sleeves and help.', 'lift'], ['Use Vine Whip', 'Let Bulbasaur gently move the branch.', 'vine'] ] },
  vines: { place: 'The thorny thicket', title: 'Handle with care.', text: 'Eevee is tangled in thorny vines. It looks frightened. You could cut it free quickly, or take your time untangling each vine.', choices: [ ['Cut the vines', 'Use your knife to free Eevee quickly.', 'cut', 'knife'], ['Untangle the vines', 'A little patience goes a long way.', 'untangle'] ] }
};
const endings = {
  build: { text: 'You build a bridge and offer Eevee a safe path across. With a few tentative steps, it reaches the riverbank. Eevee is saved!' },
  call: { text: 'Eevee leaps toward your voice—and splashes into the water! You pull it to shore. You’re both soaked, but Eevee is safe.' },
  offer: { text: 'You offer Psyduck a berry. Grateful for your kindness, it leads you right to Eevee and helps you bring it home.' },
  wait: { text: 'Psyduck eventually waddles away. The rescue takes a little longer, but you reach Eevee and guide it safely out of the woods.' },
  sneak: { text: 'You tiptoe past Onix and scoop up Eevee. Charmander lights the way out. Onix sleeps through the whole rescue.' },
  distract: { text: 'Onix wakes with a rumble! But behind that rocky face is a kind heart. It helps you and Charmander bring Eevee safely back.' },
  lower: { text: 'You lower your rope and bring Eevee safely up. Your gentle rescue helps it feel safe around you.', trust: 2 },
  find: { text: 'A hidden trail leads you straight to Eevee. Along the way, you discover a rare berry tree. A rescue and a discovery!' },
  lift: { text: 'You heave the branch up and free Eevee’s paw. You’re covered in mud, but the little Pokémon is safe and sound.' },
  vine: { text: 'Bulbasaur’s vine gently lifts the branch, freeing Eevee. Underneath, you discover a buried Poké Ball. Into your backpack it goes!', item: 'Poké Ball' },
  cut: { text: 'You cut through the vines and free Eevee. The gleaming knife frightens it, and it darts away—but at least it’s safe.', trust: -1 },
  untangle: { text: 'One vine at a time, you patiently free Eevee. It takes a while, but Eevee relaxes and leans into your hand.', trust: 2 }
};
let state;
const game = document.querySelector('#game');
const $ = id => document.getElementById(id);
function reset() { state = { step: 0, backpack: [], partner: null, trust: 1, node: null }; render(); }
function journal() {
  $('inventory').textContent = state.backpack.length ? state.backpack.map(x => supplies.find(s => s.id === x)?.name || x).join(' · ') : 'Nothing packed yet';
  $('partner').textContent = partners.find(p => p.id === state.partner)?.name || 'A friend awaits';
  $('location').textContent = state.step === 3 ? 'Safely out of the woods' : story[state.node]?.place || 'The edge of the woods';
  $('trust').textContent = '♥'.repeat(state.trust) + '♡'.repeat(3 - state.trust) + ' · ' + (state.trust >= 3 ? 'A new best friend' : state.trust === 0 ? 'Still nervous' : 'A little unsure');
  for (let i = 0; i < 3; i++) { $('step' + i).classList.toggle('active', i === Math.min(state.step, 2)); if (i === Math.min(state.step, 2)) $('step' + i).setAttribute('aria-current', 'step'); else $('step' + i).removeAttribute('aria-current'); }
}
function cards(items, selected) {
  return '<div class="cards">' + items.map(i => `<button class="card ${selected.includes(i.id) ? 'selected' : ''}" data-id="${i.id}" aria-pressed="${selected.includes(i.id)}"><span class="check">${selected.includes(i.id) ? '✓' : ''}</span><span class="icon" aria-hidden="true">${i.icon}</span><strong>${i.name}</strong><small>${i.detail}</small></button>`).join('') + '</div>';
}
function render() {
  journal();
  if (state.step === 0) {
    game.innerHTML = '<h2>First, pack a little possibility.</h2><p class="description">Choose two supplies for the journey. You never know what the woods will bring.</p>' + cards(supplies, state.backpack) + `<div class="action-row"><span class="count">${state.backpack.length} of 2 supplies packed</span><button class="primary" id="continue" ${state.backpack.length !== 2 ? 'disabled' : ''}>Choose your partner &nbsp; →</button></div><p id="packing-note" class="notice" role="status"></p>`;
    document.querySelectorAll('.card').forEach(btn => btn.onclick = () => {
      const id = btn.dataset.id;
      if (state.backpack.includes(id)) state.backpack = state.backpack.filter(x => x !== id);
      else if (state.backpack.length < 2) state.backpack.push(id);
      else { $('packing-note').textContent = 'Your bag is full. Unselect a supply to swap it.'; return; }
      render(); document.querySelector(`[data-id="${id}"]`).focus();
    });
    $('continue').onclick = () => { state.step = 1; render(); focusTitle(); };
  } else if (state.step === 1) {
    game.innerHTML = '<h2>Every explorer needs a friend.</h2><p class="description">Choose your Pokémon partner. Each one leads you down a different path.</p>' + cards(partners, [state.partner]) + `<div class="action-row"><button class="text-button" id="back">← Repack your bag</button><button class="primary" id="continue" ${!state.partner ? 'disabled' : ''}>Into the woods &nbsp; →</button></div>`;
    document.querySelectorAll('.card').forEach(btn => btn.onclick = () => { state.partner = btn.dataset.id; render(); document.querySelector(`[data-id="${state.partner}"]`).focus(); });
    $('back').onclick = () => { state.step = 0; render(); focusTitle(); };
    $('continue').onclick = () => { state.step = 2; state.node = state.partner; render(); focusTitle(); };
  } else if (state.step === 2) {
    const scene = story[state.node];
    game.innerHTML = `<h2>${scene.title}</h2><p class="description">${scene.text}</p><div class="choices">` + scene.choices.map(([label, detail, next, required]) => {
      const locked = required && !state.backpack.includes(required);
      return `<button class="choice" data-next="${next}" ${locked ? 'disabled' : ''}><span><strong>${label}</strong><small>${locked ? 'You didn’t pack a ' + required + '. Try the other path.' : detail}</small></span><span aria-hidden="true">${locked ? '⊘' : '→'}</span></button>`;
    }).join('') + '</div>';
    document.querySelectorAll('.choice').forEach(btn => btn.onclick = () => choose(btn.dataset.next));
  } else {
    const ending = endings[state.node];
    const message = state.trust >= 3 ? 'Eevee nuzzles your hand and follows you home. You gained a new Pokémon companion!' : state.trust >= 1 ? 'Eevee gives a happy cry before returning to the woods. A little kindness goes a long way.' : 'Eevee hurries into the bushes. Perhaps next time, be gentler.';
    game.innerHTML = `<div class="result"><p class="eyebrow">✦ RESCUE COMPLETE</p><h2>A little hero. A happy ending.</h2><p>${ending.text}</p><p class="ending">${message}</p></div><div class="action-row"><span class="count">There’s another path waiting for you.</span><button class="primary" id="again">Play again &nbsp; ↻</button></div>`;
    $('again').onclick = () => { reset(); focusTitle(); };
  }
}
function choose(next) {
  if (endings[next]) {
    const result = endings[next];
    state.trust += result.trust || 0;
    if (result.item) state.backpack.push(result.item);
    state.step = 3;
  }
  state.node = next; render(); focusTitle();
}
function focusTitle() { const h = game.querySelector('h2'); h.tabIndex = -1; h.focus({ preventScroll: true }); }
$('restart').onclick = () => { reset(); focusTitle(); };
reset();
