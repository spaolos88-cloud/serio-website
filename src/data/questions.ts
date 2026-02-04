export interface RawQuestion {
    id: string;
    text: string;
    type: 'MUSICAL' | 'ANALYTICAL' | 'BALANCED';
    cluster: string;
}

export const FULL_QUESTION_POOL: RawQuestion[] = [
    {
        "id": "m_q1",
        "text": "Can you listen to music for over an hour without feeling mentally tired?",
        "type": "MUSICAL",
        "cluster": "Endurance"
    },
    {
        "id": "m_q2",
        "text": "Do you ever feel relieved when the music stops?",
        "type": "MUSICAL",
        "cluster": "Endurance"
    },
    {
        "id": "m_q3",
        "text": "After long listening sessions, do your ears feel strained?",
        "type": "MUSICAL",
        "cluster": "Endurance"
    },
    {
        "id": "m_q4",
        "text": "Can you listen to full albums without needing breaks?",
        "type": "MUSICAL",
        "cluster": "Endurance"
    },
    {
        "id": "m_q5",
        "text": "Do you lower the volume instinctively after some time?",
        "type": "MUSICAL",
        "cluster": "Endurance"
    },
    {
        "id": "m_q6",
        "text": "Does music ever feel like work instead of enjoyment?",
        "type": "MUSICAL",
        "cluster": "Endurance"
    },
    {
        "id": "m_q7",
        "text": "Can you listen daily without feeling exhausted by your system?",
        "type": "MUSICAL",
        "cluster": "Endurance"
    },
    {
        "id": "m_q8",
        "text": "Do you stop listening because you feel physically tense?",
        "type": "MUSICAL",
        "cluster": "Endurance"
    },
    {
        "id": "m_q9",
        "text": "Does your body relax while music is playing?",
        "type": "MUSICAL",
        "cluster": "Endurance"
    },
    {
        "id": "m_q10",
        "text": "Do you feel more calm after listening than before?",
        "type": "MUSICAL",
        "cluster": "Endurance"
    },
    {
        "id": "m_q11",
        "text": "Can you listen late at night without irritation?",
        "type": "MUSICAL",
        "cluster": "Endurance"
    },
    {
        "id": "m_q12",
        "text": "Do you avoid long listening sessions even when you have time?",
        "type": "MUSICAL",
        "cluster": "Endurance"
    },
    {
        "id": "m_q13",
        "text": "Does your listening time naturally extend without planning?",
        "type": "MUSICAL",
        "cluster": "Endurance"
    },
    {
        "id": "m_q14",
        "text": "Do you feel alert or on edge after listening for a while?",
        "type": "MUSICAL",
        "cluster": "Endurance"
    },
    {
        "id": "m_q15",
        "text": "Can music play for hours without demanding your attention?",
        "type": "MUSICAL",
        "cluster": "Endurance"
    },
    {
        "id": "m_q16",
        "text": "Do you ever feel pressure in your head during listening?",
        "type": "MUSICAL",
        "cluster": "Endurance"
    },
    {
        "id": "m_q17",
        "text": "Does silence feel more comfortable than music sometimes?",
        "type": "MUSICAL",
        "cluster": "Endurance"
    },
    {
        "id": "m_q18",
        "text": "Do you end listening sessions earlier than you expect?",
        "type": "MUSICAL",
        "cluster": "Endurance"
    },
    {
        "id": "m_q19",
        "text": "Can you listen without feeling the need to rest your ears?",
        "type": "MUSICAL",
        "cluster": "Endurance"
    },
    {
        "id": "m_q20",
        "text": "Does your system encourage long sessions rather than short bursts?",
        "type": "MUSICAL",
        "cluster": "Endurance"
    },
    {
        "id": "m_q21",
        "text": "Can you enjoy music without actively focusing on it?",
        "type": "MUSICAL",
        "cluster": "Attention"
    },
    {
        "id": "m_q22",
        "text": "Do you need to concentrate to appreciate sound quality?",
        "type": "MUSICAL",
        "cluster": "Attention"
    },
    {
        "id": "m_q23",
        "text": "Can music play while you do other tasks comfortably?",
        "type": "MUSICAL",
        "cluster": "Attention"
    },
    {
        "id": "m_q24",
        "text": "Do you feel the need to listen closely to enjoy music?",
        "type": "MUSICAL",
        "cluster": "Attention"
    },
    {
        "id": "m_q25",
        "text": "Does background music distract you instead of relaxing you?",
        "type": "MUSICAL",
        "cluster": "Attention"
    },
    {
        "id": "m_q26",
        "text": "Can music exist as part of your environment, not an activity?",
        "type": "MUSICAL",
        "cluster": "Attention"
    },
    {
        "id": "m_q27",
        "text": "Do you lose enjoyment if you stop paying attention?",
        "type": "MUSICAL",
        "cluster": "Attention"
    },
    {
        "id": "m_q28",
        "text": "Can you enjoy music while reading or working?",
        "type": "MUSICAL",
        "cluster": "Attention"
    },
    {
        "id": "m_q29",
        "text": "Does music demand your focus to remain enjoyable?",
        "type": "MUSICAL",
        "cluster": "Attention"
    },
    {
        "id": "m_q30",
        "text": "Can you forget about the sound system while listening?",
        "type": "MUSICAL",
        "cluster": "Attention"
    },
    {
        "id": "m_q31",
        "text": "Do you analyze sound even when you try to relax?",
        "type": "MUSICAL",
        "cluster": "Attention"
    },
    {
        "id": "m_q32",
        "text": "Does music pull you in even without effort?",
        "type": "MUSICAL",
        "cluster": "Attention"
    },
    {
        "id": "m_q33",
        "text": "Do you feel uncomfortable if you are not paying attention to sound?",
        "type": "MUSICAL",
        "cluster": "Attention"
    },
    {
        "id": "m_q34",
        "text": "Can music support your mood without becoming the center of focus?",
        "type": "MUSICAL",
        "cluster": "Attention"
    },
    {
        "id": "m_q35",
        "text": "Do you treat listening as a task rather than an experience?",
        "type": "MUSICAL",
        "cluster": "Attention"
    },
    {
        "id": "m_q36",
        "text": "Do you notice when sounds stop abruptly?",
        "type": "MUSICAL",
        "cluster": "Decay"
    },
    {
        "id": "m_q37",
        "text": "Does unnatural ringing bother you?",
        "type": "MUSICAL",
        "cluster": "Decay"
    },
    {
        "id": "m_q38",
        "text": "Can you tell when notes feel cut short?",
        "type": "MUSICAL",
        "cluster": "Decay"
    },
    {
        "id": "m_q39",
        "text": "Do you feel uncomfortable when sound feels too sharp?",
        "type": "MUSICAL",
        "cluster": "Decay"
    },
    {
        "id": "m_q40",
        "text": "Does lingering sound sometimes feel natural to you?",
        "type": "MUSICAL",
        "cluster": "Decay"
    },
    {
        "id": "m_q41",
        "text": "Can overly tight sound feel stressful?",
        "type": "MUSICAL",
        "cluster": "Decay"
    },
    {
        "id": "m_q42",
        "text": "Do you notice when music feels rushed or tense?",
        "type": "MUSICAL",
        "cluster": "Decay"
    },
    {
        "id": "m_q43",
        "text": "Does natural fading of sound matter to you?",
        "type": "MUSICAL",
        "cluster": "Decay"
    },
    {
        "id": "m_q44",
        "text": "Can you tolerate very dry or clipped sound?",
        "type": "MUSICAL",
        "cluster": "Decay"
    },
    {
        "id": "m_q45",
        "text": "Do you feel when music loses its sense of flow?",
        "type": "MUSICAL",
        "cluster": "Decay"
    },
    {
        "id": "m_q46",
        "text": "Does timing matter more than clarity to you?",
        "type": "MUSICAL",
        "cluster": "Decay"
    },
    {
        "id": "m_q47",
        "text": "Can you sense when rhythm feels forced?",
        "type": "MUSICAL",
        "cluster": "Decay"
    },
    {
        "id": "m_q48",
        "text": "Do abrupt silences feel unnatural?",
        "type": "MUSICAL",
        "cluster": "Decay"
    },
    {
        "id": "m_q49",
        "text": "Does sound that breathes feel more realistic to you?",
        "type": "MUSICAL",
        "cluster": "Decay"
    },
    {
        "id": "m_q50",
        "text": "Can overly controlled sound feel lifeless?",
        "type": "MUSICAL",
        "cluster": "Decay"
    },
    {
        "id": "m_q51",
        "text": "Do you look for an immediate wow when listening?",
        "type": "MUSICAL",
        "cluster": "Wow"
    },
    {
        "id": "m_q52",
        "text": "Does excitement matter more than comfort to you?",
        "type": "MUSICAL",
        "cluster": "Wow"
    },
    {
        "id": "m_q53",
        "text": "Do you lose interest once the initial impression fades?",
        "type": "MUSICAL",
        "cluster": "Wow"
    },
    {
        "id": "m_q54",
        "text": "Do impressive sounds keep your attention longer than relaxed ones?",
        "type": "MUSICAL",
        "cluster": "Wow"
    },
    {
        "id": "m_q55",
        "text": "Does subtle sound feel boring to you?",
        "type": "MUSICAL",
        "cluster": "Wow"
    },
    {
        "id": "m_q56",
        "text": "Do you prefer sound that stands out clearly?",
        "type": "MUSICAL",
        "cluster": "Wow"
    },
    {
        "id": "m_q57",
        "text": "Do you enjoy being surprised by sound?",
        "type": "MUSICAL",
        "cluster": "Wow"
    },
    {
        "id": "m_q58",
        "text": "Does calm sound feel uninteresting to you?",
        "type": "MUSICAL",
        "cluster": "Wow"
    },
    {
        "id": "m_q59",
        "text": "Do you associate excitement with quality?",
        "type": "MUSICAL",
        "cluster": "Wow"
    },
    {
        "id": "m_q60",
        "text": "Does impressive sound feel better than natural sound?",
        "type": "MUSICAL",
        "cluster": "Wow"
    },
    {
        "id": "m_q61",
        "text": "Do you prefer sound that grabs attention quickly?",
        "type": "MUSICAL",
        "cluster": "Wow"
    },
    {
        "id": "m_q62",
        "text": "Can understated sound feel unsatisfying to you?",
        "type": "MUSICAL",
        "cluster": "Wow"
    },
    {
        "id": "m_q63",
        "text": "Do you get bored if nothing stands out?",
        "type": "MUSICAL",
        "cluster": "Wow"
    },
    {
        "id": "m_q64",
        "text": "Does dramatic sound feel more enjoyable?",
        "type": "MUSICAL",
        "cluster": "Wow"
    },
    {
        "id": "m_q65",
        "text": "Do you value stimulation over ease?",
        "type": "MUSICAL",
        "cluster": "Wow"
    },
    {
        "id": "m_q66",
        "text": "Do you often feel the urge to change something while listening?",
        "type": "MUSICAL",
        "cluster": "Stability"
    },
    {
        "id": "m_q67",
        "text": "Do you compare sound frequently, even during enjoyment?",
        "type": "MUSICAL",
        "cluster": "Stability"
    },
    {
        "id": "m_q68",
        "text": "Can you leave a system unchanged for long periods?",
        "type": "MUSICAL",
        "cluster": "Stability"
    },
    {
        "id": "m_q69",
        "text": "Do you feel curious to tweak settings while music plays?",
        "type": "MUSICAL",
        "cluster": "Stability"
    },
    {
        "id": "m_q70",
        "text": "Do you trust a system once it feels right?",
        "type": "MUSICAL",
        "cluster": "Stability"
    },
    {
        "id": "m_q71",
        "text": "Do you enjoy experimenting more than settling?",
        "type": "MUSICAL",
        "cluster": "Stability"
    },
    {
        "id": "m_q72",
        "text": "Can you stop adjusting once satisfied?",
        "type": "MUSICAL",
        "cluster": "Stability"
    },
    {
        "id": "m_q73",
        "text": "Do you feel the need to optimize constantly?",
        "type": "MUSICAL",
        "cluster": "Stability"
    },
    {
        "id": "m_q74",
        "text": "Can you live with a system without questioning it?",
        "type": "MUSICAL",
        "cluster": "Stability"
    },
    {
        "id": "m_q75",
        "text": "Do small differences bother you enough to act on them?",
        "type": "MUSICAL",
        "cluster": "Stability"
    },
    {
        "id": "m_q76",
        "text": "Do you enjoy switching setups more than listening?",
        "type": "MUSICAL",
        "cluster": "Stability"
    },
    {
        "id": "m_q77",
        "text": "Can you resist changing things when music sounds fine?",
        "type": "MUSICAL",
        "cluster": "Stability"
    },
    {
        "id": "m_q78",
        "text": "Do you feel uneasy if you don\u2019t test alternatives?",
        "type": "MUSICAL",
        "cluster": "Stability"
    },
    {
        "id": "m_q79",
        "text": "Does stability feel comforting to you?",
        "type": "MUSICAL",
        "cluster": "Stability"
    },
    {
        "id": "m_q80",
        "text": "Do you prefer consistency over novelty?",
        "type": "MUSICAL",
        "cluster": "Stability"
    },
    {
        "id": "m_q81",
        "text": "Does music still feel complete at low volume?",
        "type": "MUSICAL",
        "cluster": "Real-World"
    },
    {
        "id": "m_q82",
        "text": "Do you need higher volume to enjoy music fully?",
        "type": "MUSICAL",
        "cluster": "Real-World"
    },
    {
        "id": "m_q83",
        "text": "Can you listen quietly without losing engagement?",
        "type": "MUSICAL",
        "cluster": "Real-World"
    },
    {
        "id": "m_q84",
        "text": "Does sound fall apart when played softly?",
        "type": "MUSICAL",
        "cluster": "Real-World"
    },
    {
        "id": "m_q85",
        "text": "Can music remain enjoyable late at night at low levels?",
        "type": "MUSICAL",
        "cluster": "Real-World"
    },
    {
        "id": "m_q86",
        "text": "Do you increase volume to feel more detail?",
        "type": "MUSICAL",
        "cluster": "Real-World"
    },
    {
        "id": "m_q87",
        "text": "Does quiet listening feel satisfying?",
        "type": "MUSICAL",
        "cluster": "Real-World"
    },
    {
        "id": "m_q88",
        "text": "Do you associate quality with loudness?",
        "type": "MUSICAL",
        "cluster": "Real-World"
    },
    {
        "id": "m_q89",
        "text": "Can subtle sound hold your interest?",
        "type": "MUSICAL",
        "cluster": "Real-World"
    },
    {
        "id": "m_q90",
        "text": "Does music feel empty when played softly?",
        "type": "MUSICAL",
        "cluster": "Real-World"
    },
    {
        "id": "m_q91",
        "text": "Can you live with the same sound every day?",
        "type": "MUSICAL",
        "cluster": "Acceptance"
    },
    {
        "id": "m_q92",
        "text": "Do you stop noticing the system after a while?",
        "type": "MUSICAL",
        "cluster": "Acceptance"
    },
    {
        "id": "m_q93",
        "text": "Does sound become more comfortable over time?",
        "type": "MUSICAL",
        "cluster": "Acceptance"
    },
    {
        "id": "m_q94",
        "text": "Can you accept small imperfections without irritation?",
        "type": "MUSICAL",
        "cluster": "Acceptance"
    },
    {
        "id": "m_q95",
        "text": "Does music feel natural rather than impressive?",
        "type": "MUSICAL",
        "cluster": "Acceptance"
    },
    {
        "id": "m_q96",
        "text": "Do you feel at ease with familiar sound?",
        "type": "MUSICAL",
        "cluster": "Acceptance"
    },
    {
        "id": "m_q97",
        "text": "Can sound fade into your life without demanding attention?",
        "type": "MUSICAL",
        "cluster": "Acceptance"
    },
    {
        "id": "m_q98",
        "text": "Does long-term comfort matter more than instant impact?",
        "type": "MUSICAL",
        "cluster": "Acceptance"
    },
    {
        "id": "m_q99",
        "text": "Can you enjoy music without evaluating it?",
        "type": "MUSICAL",
        "cluster": "Acceptance"
    },
    {
        "id": "m_q100",
        "text": "Does sound feel like part of your daily rhythm?",
        "type": "MUSICAL",
        "cluster": "Acceptance"
    },
    {
        "id": "m_q101",
        "text": "Do you value comfort over precision?",
        "type": "MUSICAL",
        "cluster": "Identity"
    },
    {
        "id": "m_q102",
        "text": "Does realism matter more than excitement?",
        "type": "MUSICAL",
        "cluster": "Identity"
    },
    {
        "id": "m_q103",
        "text": "Can you tolerate sound that is not impressive?",
        "type": "MUSICAL",
        "cluster": "Identity"
    },
    {
        "id": "m_q104",
        "text": "Does music feel better when it feels effortless?",
        "type": "MUSICAL",
        "cluster": "Identity"
    },
    {
        "id": "m_q105",
        "text": "Can you accept sound that does not show off?",
        "type": "MUSICAL",
        "cluster": "Identity"
    },
    {
        "id": "m_q106",
        "text": "Do you care more about how sound feels than how it measures?",
        "type": "MUSICAL",
        "cluster": "Identity"
    },
    {
        "id": "m_q107",
        "text": "Does relaxation signal quality to you?",
        "type": "MUSICAL",
        "cluster": "Identity"
    },
    {
        "id": "m_q108",
        "text": "Can sound be good even if nothing stands out?",
        "type": "MUSICAL",
        "cluster": "Identity"
    },
    {
        "id": "m_q109",
        "text": "Do you trust your body\u2019s response more than your thoughts?",
        "type": "MUSICAL",
        "cluster": "Identity"
    },
    {
        "id": "m_q110",
        "text": "Does music feel right when you stop analyzing it?",
        "type": "MUSICAL",
        "cluster": "Identity"
    },
    {
        "id": "a_q1",
        "text": "Do you immediately notice when something sounds slightly off?",
        "type": "ANALYTICAL",
        "cluster": "Precision"
    },
    {
        "id": "a_q2",
        "text": "Do small changes in sound catch your attention quickly?",
        "type": "ANALYTICAL",
        "cluster": "Precision"
    },
    {
        "id": "a_q3",
        "text": "Do you focus on clarity before comfort?",
        "type": "ANALYTICAL",
        "cluster": "Precision"
    },
    {
        "id": "a_q4",
        "text": "Does precision matter more than ease to you?",
        "type": "ANALYTICAL",
        "cluster": "Precision"
    },
    {
        "id": "a_q5",
        "text": "Do you notice frequency imbalance right away?",
        "type": "ANALYTICAL",
        "cluster": "Precision"
    },
    {
        "id": "a_q6",
        "text": "Does blurred sound bother you?",
        "type": "ANALYTICAL",
        "cluster": "Precision"
    },
    {
        "id": "a_q7",
        "text": "Do you feel uncomfortable when instruments overlap too much?",
        "type": "ANALYTICAL",
        "cluster": "Precision"
    },
    {
        "id": "a_q8",
        "text": "Do you prefer clearly separated sounds?",
        "type": "ANALYTICAL",
        "cluster": "Precision"
    },
    {
        "id": "a_q9",
        "text": "Do you listen for detail rather than mood?",
        "type": "ANALYTICAL",
        "cluster": "Precision"
    },
    {
        "id": "a_q10",
        "text": "Does accuracy matter more than relaxation?",
        "type": "ANALYTICAL",
        "cluster": "Precision"
    },
    {
        "id": "a_q11",
        "text": "Do you enjoy hearing flaws in recordings?",
        "type": "ANALYTICAL",
        "cluster": "Truth"
    },
    {
        "id": "a_q12",
        "text": "Do you notice compression artifacts easily?",
        "type": "ANALYTICAL",
        "cluster": "Truth"
    },
    {
        "id": "a_q13",
        "text": "Do recording quality differences affect your enjoyment strongly?",
        "type": "ANALYTICAL",
        "cluster": "Truth"
    },
    {
        "id": "a_q14",
        "text": "Do you prefer honest sound even if it feels harsh?",
        "type": "ANALYTICAL",
        "cluster": "Truth"
    },
    {
        "id": "a_q15",
        "text": "Does revealing sound feel more trustworthy to you?",
        "type": "ANALYTICAL",
        "cluster": "Truth"
    },
    {
        "id": "a_q16",
        "text": "Do you dislike sound that hides imperfections?",
        "type": "ANALYTICAL",
        "cluster": "Truth"
    },
    {
        "id": "a_q17",
        "text": "Do you value transparency over forgiveness?",
        "type": "ANALYTICAL",
        "cluster": "Truth"
    },
    {
        "id": "a_q18",
        "text": "Do you prefer sound that exposes mistakes?",
        "type": "ANALYTICAL",
        "cluster": "Truth"
    },
    {
        "id": "a_q19",
        "text": "Do you feel uneasy when sound feels softened?",
        "type": "ANALYTICAL",
        "cluster": "Truth"
    },
    {
        "id": "a_q20",
        "text": "Do you trust sound more when it feels unforgiving?",
        "type": "ANALYTICAL",
        "cluster": "Truth"
    },
    {
        "id": "a_q21",
        "text": "Do you actively listen for microdetails?",
        "type": "ANALYTICAL",
        "cluster": "Speed"
    },
    {
        "id": "a_q22",
        "text": "Do you focus on attack more than decay?",
        "type": "ANALYTICAL",
        "cluster": "Speed"
    },
    {
        "id": "a_q23",
        "text": "Does speed matter more than fullness?",
        "type": "ANALYTICAL",
        "cluster": "Speed"
    },
    {
        "id": "a_q24",
        "text": "Do sharp transients feel satisfying to you?",
        "type": "ANALYTICAL",
        "cluster": "Speed"
    },
    {
        "id": "a_q25",
        "text": "Do you notice timing errors easily?",
        "type": "ANALYTICAL",
        "cluster": "Speed"
    },
    {
        "id": "a_q26",
        "text": "Do you prefer tight control over natural looseness?",
        "type": "ANALYTICAL",
        "cluster": "Speed"
    },
    {
        "id": "a_q27",
        "text": "Does overly smooth sound feel suspicious?",
        "type": "ANALYTICAL",
        "cluster": "Speed"
    },
    {
        "id": "a_q28",
        "text": "Do you associate clarity with quality?",
        "type": "ANALYTICAL",
        "cluster": "Speed"
    },
    {
        "id": "a_q29",
        "text": "Do you dislike slow or relaxed presentation?",
        "type": "ANALYTICAL",
        "cluster": "Speed"
    },
    {
        "id": "a_q30",
        "text": "Do you feel more engaged when sound is fast?",
        "type": "ANALYTICAL",
        "cluster": "Speed"
    },
    {
        "id": "a_q31",
        "text": "Do you compare sounds often while listening?",
        "type": "ANALYTICAL",
        "cluster": "Mode"
    },
    {
        "id": "a_q32",
        "text": "Do you switch tracks to test different aspects of sound?",
        "type": "ANALYTICAL",
        "cluster": "Mode"
    },
    {
        "id": "a_q33",
        "text": "Do you focus on specific elements rather than the whole?",
        "type": "ANALYTICAL",
        "cluster": "Mode"
    },
    {
        "id": "a_q34",
        "text": "Do you mentally isolate instruments while listening?",
        "type": "ANALYTICAL",
        "cluster": "Mode"
    },
    {
        "id": "a_q35",
        "text": "Do you evaluate sound even when trying to enjoy music?",
        "type": "ANALYTICAL",
        "cluster": "Mode"
    },
    {
        "id": "a_q36",
        "text": "Do you enjoy analyzing sound structure?",
        "type": "ANALYTICAL",
        "cluster": "Mode"
    },
    {
        "id": "a_q37",
        "text": "Do you listen critically by default?",
        "type": "ANALYTICAL",
        "cluster": "Mode"
    },
    {
        "id": "a_q38",
        "text": "Do you feel uncomfortable if you cannot identify details?",
        "type": "ANALYTICAL",
        "cluster": "Mode"
    },
    {
        "id": "a_q39",
        "text": "Do you replay sections to confirm what you hear?",
        "type": "ANALYTICAL",
        "cluster": "Mode"
    },
    {
        "id": "a_q40",
        "text": "Do you enjoy listening as an analytical activity?",
        "type": "ANALYTICAL",
        "cluster": "Mode"
    },
    {
        "id": "a_q41",
        "text": "Do you feel more satisfied when sound is clearly defined?",
        "type": "ANALYTICAL",
        "cluster": "Neutrality"
    },
    {
        "id": "a_q42",
        "text": "Does clean sound feel more correct than warm sound?",
        "type": "ANALYTICAL",
        "cluster": "Neutrality"
    },
    {
        "id": "a_q43",
        "text": "Do you associate neutrality with truth?",
        "type": "ANALYTICAL",
        "cluster": "Neutrality"
    },
    {
        "id": "a_q44",
        "text": "Do you dislike coloration even if it feels pleasant?",
        "type": "ANALYTICAL",
        "cluster": "Neutrality"
    },
    {
        "id": "a_q45",
        "text": "Do you feel uneasy when sound feels \u201ctoo nice\u201d?",
        "type": "ANALYTICAL",
        "cluster": "Neutrality"
    },
    {
        "id": "a_q46",
        "text": "Do you prefer predictable sound behavior?",
        "type": "ANALYTICAL",
        "cluster": "Neutrality"
    },
    {
        "id": "a_q47",
        "text": "Do you value consistency across tracks?",
        "type": "ANALYTICAL",
        "cluster": "Neutrality"
    },
    {
        "id": "a_q47",
        "text": "Do you value consistency across tracks?",
        "type": "ANALYTICAL",
        "cluster": "Neutrality"
    },
    {
        "id": "a_q48",
        "text": "Do you prefer sound that behaves the same at any volume?",
        "type": "ANALYTICAL",
        "cluster": "Neutrality"
    },
    {
        "id": "a_q49",
        "text": "Do you dislike sound that changes character over time?",
        "type": "ANALYTICAL",
        "cluster": "Neutrality"
    },
    {
        "id": "a_q50",
        "text": "Do you value control over emotion?",
        "type": "ANALYTICAL",
        "cluster": "Neutrality"
    },
    {
        "id": "a_q51",
        "text": "Do you prefer listening at moderate to higher volumes?",
        "type": "ANALYTICAL",
        "cluster": "Volume"
    },
    {
        "id": "a_q52",
        "text": "Does low-volume listening feel unsatisfying to you?",
        "type": "ANALYTICAL",
        "cluster": "Volume"
    },
    {
        "id": "a_q53",
        "text": "Do you increase volume to hear more detail?",
        "type": "ANALYTICAL",
        "cluster": "Volume"
    },
    {
        "id": "a_q54",
        "text": "Do you feel sound comes alive only when louder?",
        "type": "ANALYTICAL",
        "cluster": "Volume"
    },
    {
        "id": "a_q55",
        "text": "Does quiet listening feel incomplete?",
        "type": "ANALYTICAL",
        "cluster": "Volume"
    },
    {
        "id": "a_q56",
        "text": "Do you associate loudness with information?",
        "type": "ANALYTICAL",
        "cluster": "Volume"
    },
    {
        "id": "a_q57",
        "text": "Do you feel sound loses purpose when played softly?",
        "type": "ANALYTICAL",
        "cluster": "Volume"
    },
    {
        "id": "a_q58",
        "text": "Do you rely on volume to assess sound quality?",
        "type": "ANALYTICAL",
        "cluster": "Volume"
    },
    {
        "id": "a_q59",
        "text": "Does subtle sound feel lacking to you?",
        "type": "ANALYTICAL",
        "cluster": "Volume"
    },
    {
        "id": "a_q60",
        "text": "Do you prefer sound that demands attention?",
        "type": "ANALYTICAL",
        "cluster": "Volume"
    },
    {
        "id": "a_q61",
        "text": "Do you enjoy testing systems with challenging material?",
        "type": "ANALYTICAL",
        "cluster": "Reference"
    },
    {
        "id": "a_q62",
        "text": "Do you listen to specific tracks to evaluate sound?",
        "type": "ANALYTICAL",
        "cluster": "Reference"
    },
    {
        "id": "a_q63",
        "text": "Do you trust repeatability over first impressions?",
        "type": "ANALYTICAL",
        "cluster": "Reference"
    },
    {
        "id": "a_q64",
        "text": "Do you value reference tracks?",
        "type": "ANALYTICAL",
        "cluster": "Reference"
    },
    {
        "id": "a_q65",
        "text": "Do you compare sound across different systems often?",
        "type": "ANALYTICAL",
        "cluster": "Reference"
    },
    {
        "id": "a_q66",
        "text": "Do you feel uneasy without a clear reference point?",
        "type": "ANALYTICAL",
        "cluster": "Reference"
    },
    {
        "id": "a_q67",
        "text": "Do you prefer objective checks over long-term comfort?",
        "type": "ANALYTICAL",
        "cluster": "Reference"
    },
    {
        "id": "a_q68",
        "text": "Do you feel satisfied when sound meets expectations?",
        "type": "ANALYTICAL",
        "cluster": "Reference"
    },
    {
        "id": "a_q69",
        "text": "Do you prioritize correctness over enjoyment?",
        "type": "ANALYTICAL",
        "cluster": "Reference"
    },
    {
        "id": "a_q70",
        "text": "Do you feel confident when sound aligns with known standards?",
        "type": "ANALYTICAL",
        "cluster": "Reference"
    },
    {
        "id": "a_q71",
        "text": "Do you trust measurements to validate what you hear?",
        "type": "ANALYTICAL",
        "cluster": "Validation"
    },
    {
        "id": "a_q72",
        "text": "Do you feel reassured by technical data?",
        "type": "ANALYTICAL",
        "cluster": "Validation"
    },
    {
        "id": "a_q73",
        "text": "Do specs influence your perception of sound?",
        "type": "ANALYTICAL",
        "cluster": "Validation"
    },
    {
        "id": "a_q74",
        "text": "Do you feel uncertain without measurable confirmation?",
        "type": "ANALYTICAL",
        "cluster": "Validation"
    },
    {
        "id": "a_q75",
        "text": "Do you value data more than subjective descriptions?",
        "type": "ANALYTICAL",
        "cluster": "Validation"
    },
    {
        "id": "a_q76",
        "text": "Do you question impressions without evidence?",
        "type": "ANALYTICAL",
        "cluster": "Validation"
    },
    {
        "id": "a_q77",
        "text": "Do you associate lower distortion with better sound?",
        "type": "ANALYTICAL",
        "cluster": "Validation"
    },
    {
        "id": "a_q78",
        "text": "Do you feel clarity should be provable?",
        "type": "ANALYTICAL",
        "cluster": "Validation"
    },
    {
        "id": "a_q79",
        "text": "Do you rely on known benchmarks?",
        "type": "ANALYTICAL",
        "cluster": "Validation"
    },
    {
        "id": "a_q80",
        "text": "Do you believe correct sound should be defensible?",
        "type": "ANALYTICAL",
        "cluster": "Validation"
    },
    {
        "id": "b_q1",
        "text": "Can you enjoy music without needing it to impress you?",
        "type": "BALANCED",
        "cluster": "Acceptance"
    },
    {
        "id": "b_q2",
        "text": "Can you notice problems without losing enjoyment?",
        "type": "BALANCED",
        "cluster": "Acceptance"
    },
    {
        "id": "b_q3",
        "text": "Do you stop evaluating once the music feels right?",
        "type": "BALANCED",
        "cluster": "Acceptance"
    },
    {
        "id": "b_q4",
        "text": "Can you switch between critical listening and relaxed listening intentionally?",
        "type": "BALANCED",
        "cluster": "Acceptance"
    },
    {
        "id": "b_q5",
        "text": "Do you know when to stop analyzing and just listen?",
        "type": "BALANCED",
        "cluster": "Acceptance"
    },
    {
        "id": "b_q6",
        "text": "Can you enjoy music even when nothing stands out?",
        "type": "BALANCED",
        "cluster": "Acceptance"
    },
    {
        "id": "b_q7",
        "text": "Do you value consistency over excitement?",
        "type": "BALANCED",
        "cluster": "Acceptance"
    },
    {
        "id": "b_q8",
        "text": "Can you accept sound that feels calm rather than dramatic?",
        "type": "BALANCED",
        "cluster": "Acceptance"
    },
    {
        "id": "b_q9",
        "text": "Do you trust a system once it proves stable over time?",
        "type": "BALANCED",
        "cluster": "Acceptance"
    },
    {
        "id": "b_q10",
        "text": "Can you live with small imperfections without wanting to fix them?",
        "type": "BALANCED",
        "cluster": "Acceptance"
    },
    {
        "id": "b_q11",
        "text": "Can you enjoy different genres on the same system without adjustment?",
        "type": "BALANCED",
        "cluster": "Context"
    },
    {
        "id": "b_q12",
        "text": "Does the system still feel right across different moods?",
        "type": "BALANCED",
        "cluster": "Context"
    },
    {
        "id": "b_q13",
        "text": "Can you listen at different volumes without discomfort?",
        "type": "BALANCED",
        "cluster": "Context"
    },
    {
        "id": "b_q14",
        "text": "Does the sound remain believable at low and moderate levels?",
        "type": "BALANCED",
        "cluster": "Context"
    },
    {
        "id": "b_q15",
        "text": "Can you rely on the system without thinking about it?",
        "type": "BALANCED",
        "cluster": "Context"
    },
    {
        "id": "b_q16",
        "text": "Do you feel uneasy if a system only works with certain music?",
        "type": "BALANCED",
        "cluster": "Context"
    },
    {
        "id": "b_q17",
        "text": "Do you notice when balance shifts over time?",
        "type": "BALANCED",
        "cluster": "Context"
    },
    {
        "id": "b_q18",
        "text": "Can you recognize when a change improves one thing but harms another?",
        "type": "BALANCED",
        "cluster": "Context"
    },
    {
        "id": "b_q19",
        "text": "Do you avoid extremes in sound preference?",
        "type": "BALANCED",
        "cluster": "Context"
    },
    {
        "id": "b_q20",
        "text": "Can you accept sound that refuses to exaggerate?",
        "type": "BALANCED",
        "cluster": "Context"
    },
    {
        "id": "b_q21",
        "text": "Can you listen for long periods without fatigue?",
        "type": "BALANCED",
        "cluster": "Endurance"
    },
    {
        "id": "b_q22",
        "text": "Can you also detect issues when you choose to focus?",
        "type": "BALANCED",
        "cluster": "Endurance"
    },
    {
        "id": "b_q23",
        "text": "Do you feel comfortable leaving the system unchanged for months?",
        "type": "BALANCED",
        "cluster": "Endurance"
    },
    {
        "id": "b_q24",
        "text": "Do you avoid frequent tweaking once satisfied?",
        "type": "BALANCED",
        "cluster": "Endurance"
    },
    {
        "id": "b_q25",
        "text": "Can you enjoy music without comparing it to something else?",
        "type": "BALANCED",
        "cluster": "Endurance"
    },
    {
        "id": "b_q26",
        "text": "Do you resist the urge to upgrade when nothing is wrong?",
        "type": "BALANCED",
        "cluster": "Endurance"
    },
    {
        "id": "b_q27",
        "text": "Does stability feel more valuable than novelty?",
        "type": "BALANCED",
        "cluster": "Endurance"
    },
    {
        "id": "b_q28",
        "text": "Can you enjoy both detailed and relaxed recordings equally?",
        "type": "BALANCED",
        "cluster": "Endurance"
    },
    {
        "id": "b_q29",
        "text": "Do you feel calm rather than excited while listening?",
        "type": "BALANCED",
        "cluster": "Endurance"
    },
    {
        "id": "b_q30",
        "text": "Can music fade into your life naturally?",
        "type": "BALANCED",
        "cluster": "Endurance"
    },
    {
        "id": "b_q31",
        "text": "Can you tell when sound becomes unnatural even if it is impressive?",
        "type": "BALANCED",
        "cluster": "Realism"
    },
    {
        "id": "b_q32",
        "text": "Do you notice when sound loses realism even if it gains detail?",
        "type": "BALANCED",
        "cluster": "Realism"
    },
    {
        "id": "b_q33",
        "text": "Can you accept sound that is neither warm nor sharp?",
        "type": "BALANCED",
        "cluster": "Realism"
    },
    {
        "id": "b_q34",
        "text": "Do you prefer believable sound over impressive sound?",
        "type": "BALANCED",
        "cluster": "Realism"
    },
    {
        "id": "b_q35",
        "text": "Can you hear differences without needing to chase them?",
        "type": "BALANCED",
        "cluster": "Realism"
    },
    {
        "id": "b_q36",
        "text": "Do you trust long-term behavior more than first impressions?",
        "type": "BALANCED",
        "cluster": "Realism"
    },
    {
        "id": "b_q37",
        "text": "Can you maintain a reference without constantly questioning it?",
        "type": "BALANCED",
        "cluster": "Realism"
    },
    {
        "id": "b_q38",
        "text": "Do you feel satisfied without needing confirmation?",
        "type": "BALANCED",
        "cluster": "Realism"
    },
    {
        "id": "b_q39",
        "text": "Can you enjoy sound without defending it?",
        "type": "BALANCED",
        "cluster": "Realism"
    },
    {
        "id": "b_q40",
        "text": "Do you feel no need to prove anything through sound?",
        "type": "BALANCED",
        "cluster": "Realism"
    },
    {
        "id": "b_q41",
        "text": "Can you enjoy music on good days and bad days alike?",
        "type": "BALANCED",
        "cluster": "Integration"
    },
    {
        "id": "b_q42",
        "text": "Does the system still feel right when your attention changes?",
        "type": "BALANCED",
        "cluster": "Integration"
    },
    {
        "id": "b_q43",
        "text": "Can you listen casually without losing confidence in the sound?",
        "type": "BALANCED",
        "cluster": "Integration"
    },
    {
        "id": "b_q44",
        "text": "Do you avoid systems that demand constant attention?",
        "type": "BALANCED",
        "cluster": "Integration"
    },
    {
        "id": "b_q45",
        "text": "Can you live with a system that does not flatter everything?",
        "type": "BALANCED",
        "cluster": "Integration"
    },
    {
        "id": "b_q46",
        "text": "Do you value reliability over surprise?",
        "type": "BALANCED",
        "cluster": "Integration"
    },
    {
        "id": "b_q47",
        "text": "Can you accept sound that simply works?",
        "type": "BALANCED",
        "cluster": "Integration"
    },
    {
        "id": "b_q48",
        "text": "Do you feel comfortable recommending a system without disclaimers?",
        "type": "BALANCED",
        "cluster": "Integration"
    },
    {
        "id": "b_q49",
        "text": "Can you trust your judgment without external validation?",
        "type": "BALANCED",
        "cluster": "Integration"
    },
    {
        "id": "b_q50",
        "text": "Does sound feel like a tool, not a statement?",
        "type": "BALANCED",
        "cluster": "Integration"
    },
    {
        "id": "b_q51",
        "text": "Can you identify when your mood affects your perception?",
        "type": "BALANCED",
        "cluster": "Restraint"
    },
    {
        "id": "b_q52",
        "text": "Can you separate your preference from correctness?",
        "type": "BALANCED",
        "cluster": "Restraint"
    },
    {
        "id": "b_q53",
        "text": "Do you avoid judging sound based on short demos alone?",
        "type": "BALANCED",
        "cluster": "Restraint"
    },
    {
        "id": "b_q54",
        "text": "Can you wait before forming conclusions?",
        "type": "BALANCED",
        "cluster": "Restraint"
    },
    {
        "id": "b_q55",
        "text": "Do you accept that no system is perfect?",
        "type": "BALANCED",
        "cluster": "Restraint"
    },
    {
        "id": "b_q56",
        "text": "Can you appreciate sound without idealizing it?",
        "type": "BALANCED",
        "cluster": "Restraint"
    },
    {
        "id": "b_q57",
        "text": "Do you recognize when excitement fades but correctness remains?",
        "type": "BALANCED",
        "cluster": "Restraint"
    },
    {
        "id": "b_q58",
        "text": "Can you stop chasing improvements once balance is reached?",
        "type": "BALANCED",
        "cluster": "Restraint"
    },
    {
        "id": "b_q59",
        "text": "Do you feel content without constant change?",
        "type": "BALANCED",
        "cluster": "Restraint"
    },
    {
        "id": "b_q60",
        "text": "Can you live with sound as it is?",
        "type": "BALANCED",
        "cluster": "Restraint"
    },
    {
        "id": "b_q61",
        "text": "Can you enjoy both emotional and technical aspects of music?",
        "type": "BALANCED",
        "cluster": "Philosophical"
    },
    {
        "id": "b_q62",
        "text": "Can you acknowledge strengths and weaknesses at the same time?",
        "type": "BALANCED",
        "cluster": "Philosophical"
    },
    {
        "id": "b_q63",
        "text": "Do you avoid absolute judgments about sound?",
        "type": "BALANCED",
        "cluster": "Philosophical"
    },
    {
        "id": "b_q64",
        "text": "Can you respect different listening preferences?",
        "type": "BALANCED",
        "cluster": "Philosophical"
    },
    {
        "id": "b_q65",
        "text": "Do you avoid forcing others to agree with you?",
        "type": "BALANCED",
        "cluster": "Philosophical"
    },
    {
        "id": "b_q66",
        "text": "Can you adapt your listening without changing the system?",
        "type": "BALANCED",
        "cluster": "Philosophical"
    },
    {
        "id": "b_q67",
        "text": "Do you feel confident without evangelizing your setup?",
        "type": "BALANCED",
        "cluster": "Philosophical"
    },
    {
        "id": "b_q68",
        "text": "Can you enjoy sound without ranking it?",
        "type": "BALANCED",
        "cluster": "Philosophical"
    },
    {
        "id": "b_q69",
        "text": "Do you accept sound as contextual, not absolute?",
        "type": "BALANCED",
        "cluster": "Philosophical"
    },
    {
        "id": "b_q70",
        "text": "Does balance feel more important than perfection?",
        "type": "BALANCED",
        "cluster": "Philosophical"
    },
    {
        "id": "b_q71",
        "text": "Can you maintain interest without stimulation?",
        "type": "BALANCED",
        "cluster": "Reliability"
    },
    {
        "id": "b_q72",
        "text": "Can you accept sound that does not flatter your taste?",
        "type": "BALANCED",
        "cluster": "Reliability"
    },
    {
        "id": "b_q73",
        "text": "Do you avoid systems that only shine under attention?",
        "type": "BALANCED",
        "cluster": "Reliability"
    },
    {
        "id": "b_q74",
        "text": "Can you live with sound that does not call attention to itself?",
        "type": "BALANCED",
        "cluster": "Reliability"
    },
    {
        "id": "b_q75",
        "text": "Do you value predictability over surprise?",
        "type": "BALANCED",
        "cluster": "Reliability"
    },
    {
        "id": "b_q76",
        "text": "Can you trust sound across time, not moments?",
        "type": "BALANCED",
        "cluster": "Reliability"
    },
    {
        "id": "b_q77",
        "text": "Do you prefer sound that remains correct tomorrow?",
        "type": "BALANCED",
        "cluster": "Reliability"
    },
    {
        "id": "b_q78",
        "text": "Can you avoid emotional attachment to gear?",
        "type": "BALANCED",
        "cluster": "Reliability"
    },
    {
        "id": "b_q79",
        "text": "Do you feel no urge to defend your system?",
        "type": "BALANCED",
        "cluster": "Reliability"
    },
    {
        "id": "b_q80",
        "text": "Does sound feel settled rather than exciting?",
        "type": "BALANCED",
        "cluster": "Reliability"
    }
];
