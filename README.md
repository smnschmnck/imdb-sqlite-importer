# 🎬 imdb-sqlite-importer

A small utility to download the latest [IMDb non‑commercial datasets](https://datasets.imdbws.com), import them into a local **SQLite database**, and keep them in sync with a [Drizzle ORM](https://orm.drizzle.team/) schema.

I created this project because I needed an easy way to get the latest IMDb ratings data for my other project [**tv-stats**](https://github.com/smnschmnck/tv-stats) ([tvstats.app](https://tvstats.app)), which tracks and visualizes TV show ratings.

## ℹ️ Prerequisites

You’ll need [**Bun**](https://bun.sh) installed (latest version recommended).

## 📂 Data Sources

Currently downloads and imports the following IMDb non‑commercial datasets:

- `title.ratings.tsv.gz` → average rating + number of votes for each title
- `title.episode.tsv.gz` → mapping episodes to shows, with season + episode numbers

## 🚀 Usage

### 1. Install Dependencies

```bash
bun install
```

### 2. Migrate DB

```bash
bun run db:push
```

### 3. Fetch & Import IMDb Datasets

```bash
bun run start
```

## 📊 Viewing Your Data

Open the database in Drizzle Studio:

```bash
bun run db:studio
```
