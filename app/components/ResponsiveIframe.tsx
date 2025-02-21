"use client";

import { useEffect, useRef, useState } from "react";

interface ResponsiveIframeProps {
	src: string;
	initialWidth?: number;
	initialHeight?: number;
}

export default function ResponsiveIframe({
	src,
	initialWidth = 500,
	initialHeight = 300,
}: ResponsiveIframeProps) {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const [scale, setScale] = useState(1);
	const [dimensions, setDimensions] = useState({
		width: initialWidth,
		height: initialHeight,
	});

	useEffect(() => {
		const handleResize = () => {
			if (wrapperRef.current && iframeRef.current) {
				const wrapperWidth = wrapperRef.current.offsetWidth;
				const wrapperHeight = wrapperRef.current.offsetHeight;

				// Get actual iframe dimensions
				const iframeWidth = dimensions.width;
				const iframeHeight = dimensions.height;

				// Calculate scale ratios for both dimensions
				const wScale = wrapperWidth / iframeWidth;
				const hScale = wrapperHeight / iframeHeight;

				// Use the smaller scale to maintain aspect ratio
				const newScale = Math.min(wScale, hScale, 1); // Don't scale up beyond original size
				setScale(newScale);
			}
		};

		// Handle iframe load to get actual dimensions
		const handleIframeLoad = () => {
			if (iframeRef.current) {
				const width = iframeRef.current.offsetWidth;
				const height = iframeRef.current.offsetHeight;
				setDimensions({ width, height });
			}
		};

		handleResize(); // Initial calculation
		window.addEventListener("resize", handleResize);

		if (iframeRef.current) {
			iframeRef.current.addEventListener("load", handleIframeLoad);
		}

		return () => {
			window.removeEventListener("resize", handleResize);
			if (iframeRef.current) {
				iframeRef.current.removeEventListener("load", handleIframeLoad);
			}
		};
	}, [dimensions]);

	return (
		<div
			ref={wrapperRef}
			style={{
				width: "100%",
				height: dimensions.height * scale,
				overflow: "hidden",
			}}
		>
			<div
				style={{
					transform: `scale(${scale})`,
					transformOrigin: "top left",
					width: dimensions.width,
					height: dimensions.height,
				}}
			>
				<iframe
					ref={iframeRef}
					src={src}
					width={dimensions.width}
					height={dimensions.height}
					style={{
						border: "none",
					}}
				/>
			</div>
		</div>
	);
}
