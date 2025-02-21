"use client";

import React, { useEffect, useRef } from "react";
import Script from "next/script";
import jQuery from "jquery";

declare global {
	interface Window {
		jQuery: typeof jQuery;
	}
}

// Extend Window interface to include jQuery
declare global {
	interface Window {
		jQuery: typeof jQuery;
	}
}

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
	const initialized = useRef(false);

	useEffect(() => {
		if (initialized.current) return;
		initialized.current = true;

		const initializeScaler = () => {
			if (!wrapperRef.current || typeof window.jQuery === "undefined") return;

			const $ = window.jQuery;
			const $wrap = $(wrapperRef.current);

			function iframeScaler() {
				const wrapWidth = $wrap.width() || width;
				const wrapHeight = $wrap.height() || height;
				const childWidth = $wrap.children("iframe").width() || width;
				const childHeight = $wrap.children("iframe").height() || height;
				const wScale = wrapWidth / childWidth;
				const hScale = wrapHeight / childHeight;
				const scale = Math.min(wScale, hScale);

				$wrap.children("iframe").css({
					transform: `scale(${scale})`,
					"transform-origin": "left top",
				});
			}

			$(window).on("resize", iframeScaler);
			iframeScaler();

			return () => {
				$(window).off("resize", iframeScaler);
			};
		};

		// Wait for jQuery to load
		if (typeof window.jQuery === "undefined") {
			const checkJQuery = setInterval(() => {
				if (typeof window.jQuery !== "undefined") {
					clearInterval(checkJQuery);
					initializeScaler();
				}
			}, 100);

			// Cleanup interval if component unmounts
			return () => clearInterval(checkJQuery);
		} else {
			initializeScaler();
		}
	}, [height, width]);

	return (
		<>
			<Script
				src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"
				strategy="afterInteractive"
			/>
			<div ref={wrapperRef} style={{ margin: 0, padding: 0 }}>
				<iframe
					width={width}
					height={height}
					seamless
					frameBorder="0"
					scrolling="no"
					src={src}
				/>
			</div>
		</>
	);
}
