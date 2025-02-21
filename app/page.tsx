import styles from "./test.module.css";

export default function Home() {
	const cssVariables = {
		"--iframe-mobile-width": "396",
		"--iframe-mobile-height": "3200px",
		"--iframe-breakpoint": "790px",
	} as React.CSSProperties;

	return (
		<div className={styles.iframeContainer} style={cssVariables}>
			<h1>Test Page</h1>
			<iframe
				className={styles.iframe}
				src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQsPgphmRJq61JPI8DV_R6wUjHjoG8x_mRjU4NVI2Bk-6zx94ZPXV4XTH4lPRZK8j0k1iFKuIZEOHZr/pubhtml?gid=421427572&amp;single=true&amp;widget=true&amp;headers=false"
			></iframe>
		</div>
	);
}
