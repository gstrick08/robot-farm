// Paired writes recover a checkpoint and its rewards together after an interrupted save.
export const JOB_KEY = 'robotfarm.jobs.v1';
export function validJobs(jobs) {
  const integer = (n, max) => Number.isInteger(n) && n >= 0 && n <= max;
  const key = k => typeof k === 'string' && /^(W:.+|L:[A-Za-z])$/.test(k);
  return Array.isArray(jobs) && jobs.length <= 5 && jobs.every(j => {
    const m = j?.m, q = j?.question;
    return j && typeof j.context === 'string' && integer(j.n, 4) && integer(j.job, 3)
      && ['hunt','pods','letters','twins','boss'].includes(j.type) && ['question','advance','action'].includes(j.phase)
      && m && m.nGold === 10 && m.cap === 15 && integer(m.golds,10) && integer(m.silvers,15)
      && integer(m.asked,15) && m.golds + m.silvers <= m.asked && typeof m.firstTry === 'boolean'
      && integer(j.paidGold,m.golds) && Array.isArray(m.queue) && m.queue.length <= 30 && m.queue.every(key)
      && (m.current === null || key(m.current)) && Array.isArray(m.lastPos) && m.lastPos.length <= 2 && m.lastPos.every(p => integer(p,5))
      && (!q || (Array.isArray(q.options) && q.options.length >= 2 && q.options.length <= 6
        && q.options.every(key) && new Set(q.options).size === q.options.length && q.options.includes(m.current)
        && Array.isArray(q.wrong) && q.wrong.every(k => k !== m.current && q.options.includes(k))
        && typeof q.hint === 'boolean' && typeof q.font === 'string' && typeof q.teach === 'boolean'))
      && (j.phase !== 'question' || !!q);
  });
}
function completeSave(raw) {
  const s = JSON.parse(raw);
  return s?.v === 1 && s.items && typeof s.items === 'object' && !Array.isArray(s.items)
    && Array.isArray(s.farm) && s.farm.length === 60 && Array.isArray(s.lists) && s.lists.length > 0
    && s.settings && s.day && Array.isArray(s.day.done)
    && [s.seeds,s.goldSeeds,s.coins].every(n => Number.isInteger(n) && n >= 0);
}
export function readProgress(storage, key) {
  let raw = null;
  try {
    raw = storage.getItem(key);
    const pair = JSON.parse(storage.getItem(JOB_KEY));
    if (pair?.v === 1 && completeSave(pair.after) && validJobs(pair.jobs) && (raw === pair.after || raw === pair.before)) {
      if (raw !== pair.after) storage.setItem(key, pair.after);
      return { raw: pair.after, jobs: pair.jobs };
    }
  } catch { /* A damaged checkpoint must never erase the original learning save. */ }
  return { raw, jobs: [] };
}
export function writeProgress(storage, key, state, jobs) {
  const after = JSON.stringify(state), before = storage.getItem(key);
  storage.setItem(JOB_KEY, JSON.stringify({ v: 1, before, after, jobs }));
  storage.setItem(key, after);
}
