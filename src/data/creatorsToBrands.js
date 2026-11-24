export const youtubeCard = {
  number: '01',
  tag: 'YOUTUBE CREATORS',
  title: 'Long-form, Shorts and everything between.',
  text: "We've edited for **50+ creators**. Weekly uploads, quick turnarounds and a look viewers recognise.",
  chips: ['Long-form', 'Shorts', 'Thumbnails', 'Intros & outros'],
};

export const podcastCard = {
  number: '02',
  tag: 'PODCAST POST-PRODUCTION',
  title: 'Every episode, in every format.',
  text: 'Long-form video, short clips and audio versions, all cut from one recording.',
  tabs: [
    {
      id: 'long-video',
      label: 'Long video',
      type: 'vimeo',
      // from longForm.js -> 'talking-head' -> th-1
      src: 'https://vimeo.com/1243692983',
    },
    {
      id: 'short-clips',
      label: 'Short clips',
      type: 'file',
      // from shortForm.js -> s-1
      src: '/videos/portfolio/short-form/talking-head/video-01.mp4',
    },
    // Audio tab hidden for now
    // { id: 'audio', label: 'Audio', seconds: 6.5 },
  ],
  showNames: '[Podcast names]',
  showCount: '[00] shows edited so far',
  avatars: ['#FFE11A', '#F2F2F2', '#D8431C', '#2B2B2B'],
};

export const brandFilmCard = {
  number: '03',
  tag: 'BRAND FILMS · TV · OTT',
  title: 'Broadcast-ready commercials and brand films.',
  text: 'Spots for TV, OTT and digital, finished to spec with grade, sound and delivery formats covered.',
  poster: 'images/home/brand-film/brand-film-poster.webp',
  video: null,
  caption: '[Brand name] 30s spot',
  chips: ['TV spots', 'OTT ads', 'Brand films', 'Social cutdowns'],
};
