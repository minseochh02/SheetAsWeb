"use client";

import { useEffect, useRef } from "react";

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

	useEffect(() => {
		const wrapper = wrapperRef.current;
		const iframe = iframeRef.current;

		if (!wrapper || !iframe) return;

		const iframeScaler = () => {
			// Get wrapper dimensions
			const wrapWidth = wrapper.offsetWidth;
			const wrapHeight = wrapper.offsetHeight;

			// Get iframe dimensions
			const childWidth = iframe.offsetWidth || initialWidth;
			const childHeight = iframe.offsetHeight || initialHeight;

			// Calculate scale ratios
			const wScale = wrapWidth / childWidth;
			const hScale = wrapHeight / childHeight;

			// Use the smallest ratio
			const scale = Math.min(wScale, hScale, 1);

			// Apply transform
			iframe.style.transform = `scale(${scale})`;
			iframe.style.transformOrigin = "top left";

			// Update wrapper height to match scaled content
			wrapper.style.height = `${childHeight * scale}px`;
		};

		// Run on mount and resize
		iframeScaler();
		window.addEventListener("resize", iframeScaler);

		// Also run when iframe loads
		iframe.addEventListener("load", iframeScaler);

		return () => {
			window.removeEventListener("resize", iframeScaler);
			iframe.removeEventListener("load", iframeScaler);
		};
	}, [initialWidth, initialHeight]);

	return (
		<div
			ref={wrapperRef}
			style={{
				width: "100%",
				overflow: "hidden",
			}}
		>
			<iframe
				ref={iframeRef}
				src={src}
				width={initialWidth}
				height={initialHeight}
				style={{
					border: "none",
					transformOrigin: "top left",
				}}
			/>
		</div>
	);
}
