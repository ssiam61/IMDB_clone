import React, { useEffect, useState, Fragment } from "react";
import SeriesCard from "./seriescard";

const Series = () => {
	const [seriesList, setSeriesList] = useState([]);

	useEffect(() => {
		const fetchSeries = async () => {
			try {
				// Fetch all series, then join with media info
				const seriesRes = await fetch("http://localhost:5000/series");
				const seriesArr = await seriesRes.json();
				if (!Array.isArray(seriesArr) || seriesArr.length === 0) {
					setSeriesList([]);
					return;
				}
				// Get all media_ids
				const mediaIds = seriesArr.map(s => s.media_id);
				// Fetch all media in one go
				const mediaRes = await fetch("http://localhost:5000/media");
				const mediaArr = await mediaRes.json();
				// Join series with media info
				const joined = seriesArr.map(s => {
					const media = mediaArr.find(m => m.id === s.media_id) || {};
					return { ...s, ...media };
				});
				setSeriesList(joined);
			} catch (err) {
				setSeriesList([]);
			}
		};
		fetchSeries();
	}, []);

	return (
		<Fragment>
			<h1 className="text-center mt-5">Series</h1>
			<div className="row row-cols-1 row-cols-md-3 g-4 mt-4">
				{seriesList.map(series => (
					<div className="col" key={series.id}>
						<SeriesCard series={series} />
					</div>
				))}
			</div>
		</Fragment>
	);
};

export default Series;
