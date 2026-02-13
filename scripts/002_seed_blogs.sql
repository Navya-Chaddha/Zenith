-- Seed sample blog posts (using a placeholder author_id that bypasses RLS for seeding)
-- These will be visible to all users since they are published

-- First, temporarily disable RLS for seeding
ALTER TABLE public.blogs DISABLE ROW LEVEL SECURITY;

INSERT INTO public.blogs (title, excerpt, content, published, author_id, read_count) VALUES
(
  'The James Webb Space Telescope: Rewriting Our Understanding of the Universe',
  'How JWST is revealing the earliest galaxies and transforming our cosmic timeline.',
  'The James Webb Space Telescope has fundamentally changed how we see the universe. Since its deployment at the second Lagrange point, approximately 1.5 million kilometers from Earth, JWST has been peering deeper into the cosmos than any instrument before it.

Its infrared capabilities allow it to see through cosmic dust clouds that previously obscured our view, revealing stellar nurseries where new stars are being born. The level of detail is extraordinary — we can now observe individual stars in galaxies that are billions of light-years away.

One of the most groundbreaking discoveries has been the identification of galaxies that formed just a few hundred million years after the Big Bang. These galaxies are far more massive and structured than our models predicted, forcing astrophysicists to reconsider theories about how quickly the universe organized after its birth.

JWST has also turned its powerful gaze on exoplanets, analyzing their atmospheres for signs of water vapor, carbon dioxide, and other molecules that could indicate habitability. The telescope detected carbon dioxide in the atmosphere of WASP-39 b, marking the first definitive detection of the gas in an exoplanet atmosphere.

The implications are staggering. We are not just looking at distant objects — we are looking back in time, witnessing the universe in its infancy, and finding clues about how everything we know came to be.',
  true,
  '00000000-0000-0000-0000-000000000000',
  42
),
(
  'Artemis Program: Humanity Returns to the Moon',
  'NASA''s ambitious plan to establish a permanent human presence on the lunar surface.',
  'The Artemis program represents humanity''s boldest step back toward the Moon since the Apollo era. But this time, the goal is not just to visit — it is to stay. NASA, in collaboration with international partners and commercial space companies, is building the infrastructure for a sustained presence on and around the Moon.

The Space Launch System (SLS) rocket and the Orion spacecraft form the backbone of the program. Together, they are capable of carrying astronauts further into space than any spacecraft built for humans has ever flown. The first crewed missions will orbit the Moon, followed by surface landings near the lunar south pole.

Why the south pole? Scientists believe that permanently shadowed craters in this region contain water ice — a resource that could be used for drinking water, oxygen generation, and even rocket fuel. In-situ resource utilization (ISRU) is a key part of the Artemis strategy, aiming to reduce the need to carry everything from Earth.

The Gateway, a small space station in lunar orbit, will serve as a staging point for surface missions and a platform for scientific research. It represents a new paradigm in space exploration — a reusable, modular outpost that can support missions to the Moon and eventually Mars.

Artemis is not just a NASA program. It is an international effort involving the European Space Agency, the Japan Aerospace Exploration Agency, and the Canadian Space Agency, along with commercial partners like SpaceX and Blue Origin. Together, they are writing the next chapter of human space exploration.',
  true,
  '00000000-0000-0000-0000-000000000000',
  28
),
(
  'The Search for Life on Mars: What Perseverance Has Found',
  'Analyzing rock samples and ancient riverbeds on the Red Planet.',
  'NASA''s Perseverance rover has been exploring Jezero Crater on Mars since February 2021, and the findings have been remarkable. The crater, once home to an ancient lake fed by a river delta, is considered one of the best places on Mars to search for signs of past microbial life.

Perseverance has collected and cached dozens of rock samples, carefully sealed in titanium tubes for a future Mars Sample Return mission. These samples contain organic molecules — carbon-based compounds that are the building blocks of life as we know it. While the presence of organic molecules does not confirm past life, it tells us the chemical ingredients were there.

The rover''s instruments have also detected minerals that form in the presence of water, further confirming that Jezero Crater was indeed a wet environment billions of years ago. Layered sedimentary rocks along the ancient delta show patterns consistent with flowing water carrying fine-grained material.

Perhaps most exciting is the discovery of carbonate minerals along the inner rim of the crater. On Earth, carbonates often form in habitable conditions and can preserve signs of ancient life. If similar processes occurred on Mars, these rocks could hold microscopic fossils.

The Ingenuity helicopter, Perseverance''s companion, has far exceeded its original mission, completing over 70 flights and scouting terrain ahead of the rover. Together, this robotic duo is building the most detailed picture of Mars we have ever had, and bringing us closer to answering the profound question: are we alone in the universe?',
  true,
  '00000000-0000-0000-0000-000000000000',
  35
);

-- Re-enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
