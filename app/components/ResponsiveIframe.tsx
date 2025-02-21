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
	const [scale, setScale] = useState(1);

	useEffect(() => {
		const handleResize = () => {
			if (wrapperRef.current) {
				const wrapperWidth = wrapperRef.current.offsetWidth;
				const newScale = wrapperWidth / initialWidth;
				setScale(Math.min(newScale, 1)); // Don't scale up beyond original size
			}
		};

		handleResize(); // Initial calculation
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, [initialWidth]);

	return (
		<div
			ref={wrapperRef}
			style={{
				width: "100%",
				height: initialHeight * scale,
				overflow: "hidden",
			}}
		>
			<div
				style={{
					transform: `scale(${scale})`,
					transformOrigin: "top left",
					width: initialWidth,
					height: initialHeight,
				}}
			>
				<iframe
					src={src}
					width={initialWidth}
					height={initialHeight}
					style={{
						border: "none",
					}}
				/>
			</div>
		</div>
	);
}
