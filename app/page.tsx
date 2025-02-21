import ResponsiveIframe from "./components/ResponsiveIframe";

export default function Home() {
	return (
		<div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
			<h1>Test Page</h1>
			<ResponsiveIframe
				src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQsPgphmRJq61JPI8DV_R6wUjHjoG8x_mRjU4NVI2Bk-6zx94ZPXV4XTH4lPRZK8j0k1iFKuIZEOHZr/pubhtml?gid=421427572&widget=true&headers=false&chrome=false&rm=minimal"
				initialWidth={800}
				initialHeight={600}
			/>
		</div>
	);
}
