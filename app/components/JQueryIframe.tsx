"use client";

import Script from "next/script";
import { useEffect } from "react";

interface JQueryIframeProps {
	src: string;
	width?: number;
	height?: number;
}

declare global {
	interface Window {
		$: any;
		jQuery: any;
	}
}

export default function JQueryIframe({
	src,
	width = 500,
	height = 300,
}: JQueryIframeProps) {
	useEffect(() => {
		// Wait for jQuery to be available
		const checkJQuery = setInterval(() => {
			if (window.jQuery) {
				clearInterval(checkJQuery);

				// Original jQuery code
				window.$(function () {
					window.$("#wrapper").each(function () {
						const $wrap = window.$(this);

						function iframeScaler() {
							const wrapWidth = $wrap.width();
							const wrapHeight = $wrap.height();
							const childWidth = $wrap.children("iframe").width();
							const childHeight = $wrap.children("iframe").height();
							const wScale = wrapWidth / childWidth;
							const hScale = wrapHeight / childHeight;
							const scale = Math.min(wScale, hScale);
							$wrap.children("iframe").css({
								transform: "scale(" + scale + ")",
								"transform-origin": "left top",
							});
						}

						window.$(window).on("resize", iframeScaler);
						window.$(document).ready(iframeScaler);
					});
				});
			}
		}, 100);

		return () => clearInterval(checkJQuery);
	}, []);

	return (
		<>
			<Script
				src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"
				strategy="beforeInteractive"
			/>

			<div id="wrapper">
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
