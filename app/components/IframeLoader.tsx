"use client";

import React, { useEffect, useRef } from "react";

interface IframeLoaderProps {
	src: string;
	width?: number;
	height?: number;
}

export default function IframeLoader({
	src,
	width = 1405,
	height = 826,
}: IframeLoaderProps) {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const initialized = useRef(false);

	useEffect(() => {
		if (initialized.current) return;
		initialized.current = true;

		const wrapper = wrapperRef.current;
		const iframe = iframeRef.current;
		if (!wrapper || !iframe) return;

		const calculateScale = () => {
			const wrapWidth = wrapper.clientWidth || width;
			const wrapHeight = wrapper.clientHeight || height;
			const childWidth = width;
			const childHeight = height;

			const wScale = wrapWidth / childWidth;
			const hScale = wrapHeight / childHeight;
			const scale = Math.min(wScale, hScale);

			iframe.style.transform = `scale(${scale})`;
			iframe.style.transformOrigin = "left top";
		};

		// Create a ResizeObserver to watch for wrapper size changes
		const resizeObserver = new ResizeObserver(calculateScale);
		resizeObserver.observe(wrapper);

		// Initial calculation
		calculateScale();

		// Cleanup
		return () => {
			resizeObserver.disconnect();
		};
	}, [height, width]);

	return (
		<div ref={wrapperRef} style={{ margin: 0, padding: 0 }}>
			<iframe
				ref={iframeRef}
				width={width}
				height={height}
				seamless
				frameBorder="0"
				scrolling="no"
				src={src}
			/>
		</div>
	);
}
