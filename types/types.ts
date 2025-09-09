export type EpisodeDataset = { dataset: "title.episode"; path: string };
export type RatingDataset = { dataset: "title.ratings"; path: string };

export type DatasetInfo = EpisodeDataset | RatingDataset;

export type DatasetName = DatasetInfo["dataset"];
