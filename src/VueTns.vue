<template>
	<div class="vue-tns-slider__container">
		<div class="vue-tns-slider" :style="sliderStyle">
			<slot></slot>
		</div>
		<template v-if="instance">
			<div :class="props.controlsClass">
				<button type="button" :class="props.prevButtonClass" @click="instance.goTo('prev', $event)">
					<slot name="prev-button">
						<SvgIcon :path="mdiChevronLeft" size="72" />
					</slot>
				</button>
				<button type="button" :class="props.nextButtonClass" @click="instance.goTo('next', $event)">
					<slot name="next-button">
						<SvgIcon :path="mdiChevronRight" size="72" />
					</slot>
				</button>
			</div>
			<nav :class="props.navClass">
				<button
					v-for="n in pages"
					:key="n"
					type="button"
					:class="props.navButtonClass"
					:data-nav="n - 1"
					:aria-controls="slideId"
					@click="instance.onNavClick"
				>
					<slot name="nav-button" :is-active="navCurrentIndex == n - 1">
						<SvgIcon
							:size="props.navButtonSize"
							:path="navCurrentIndex == n - 1 ? mdiCircleSlice8 : mdiCircleOutline"
						/>
					</slot>
				</button>
			</nav>
		</template>
	</div>
</template>

<script setup>
import SvgIcon from "vue3-icon";
import { mdiChevronLeft, mdiChevronRight, mdiCircleOutline, mdiCircleSlice8 } from "@mdi/js";
import { onMounted, ref, computed, onUnmounted, useSlots, nextTick } from "vue";
import { tns } from "./tns/index";
import { getSlideId } from "./tns/helpers/getSlideId";
import { useResponsiveConfig } from "./composables/useResponsiveConfig";

const props = defineProps({
	mode: {
		type: String,
		default: "carousel",
		validator: (v) => ["carousel", "gallery"].includes(v)
	},
	items: {
		type: Number,
		default: 1,
		validator: (v) => v > 0
	},
	gutter: {
		type: Number,
		default: 0,
		validator: (v) => v >= 0
	},
	edgePadding: {
		type: Number,
		default: 0,
		validator: (v) => v >= 0
	},
	fixedWidth: {
		type: [Boolean, Number],
		default: false,
		validator: (v) => {
			if (typeof v === "boolean") return v === false;
			else return v > 0;
		}
	},
	autoWidth: {
		type: Boolean,
		default: false
	},
	autoHeight: {
		type: Boolean,
		default: false
	},
	speed: {
		type: Number,
		default: 300,
		validator: (v) => v > 0
	},
	slideBy: {
		type: [Number, String],
		default: 1,
		validator: (v) => {
			if (typeof v === "number") return v > 0;
			else return v === "page";
		}
	},
	autoplay: {
		type: Boolean,
		default: false
	},
	direction: {
		type: String,
		default: "horizontal",
		validator: (v) => ["horizontal", "vertical"].includes(v)
	},
	centre: {
		type: Boolean,
		default: false
	},
	center: {
		type: Boolean,
		default: false
	},
	loop: {
		type: Boolean,
		default: true
	},
	responsive: {
		type: Object,
		default: () => ({})
	},
	pauseOnHover: {
		type: Boolean,
		default: false
	},
	lazy: {
		type: Boolean,
		default: false
	},
	lazySelector: {
		type: String,
		default: ".vue-tns-lazy-img"
	},
	disable: {
		type: Boolean,
		default: false
	},
	/* *********************************************
	 * CLASSES
	 * ******************************************* */
	controlsClass: {
		type: String,
		default: "vue-tns-slider__controls"
	},
	prevButtonClass: {
		type: String,
		default: "vue-tns-slider__prev-button"
	},
	nextButtonClass: {
		type: String,
		default: "vue-tns-slider__next-button"
	},
	navClass: {
		type: String,
		default: "vue-tns-slider__nav"
	},
	navButtonClass: {
		type: String,
		default: "vue-tns-slider__nav-button"
	},
	navButtonSize: {
		type: Number,
		default: 24
	},
	height: {
		type: String,
		default: null
	}
});

const sliderStyle = computed(() => {
	const style = {};
	if (props.height) style.height = props.height;
	return style;
});

const navCurrentIndex = computed(() => instance.value?.navCurrentIndex ?? 0);

const slideCount = computed(() => {
	const slots = useSlots();
	if (slots) return slots.default()?.[0]?.children?.length || 0;
	else return 0;
});
const instance = ref({});
const pages = computed(() => instance.value?.pages ?? 1);

const slideId = getSlideId();

const responsive = useResponsiveConfig(props);

onMounted(async () => {
	if (instance.value?.rebuild) return instance.value.rebuild();

	instance.value = tns({
		slideId,
		container: ".vue-tns-slider",
		mode: props.mode,
		navContainer: false,
		axis: props.direction,
		items: props.items,
		slideBy: props.slideBy,
		autoplay: props.autoplay,
		speed: props.speed,
		responsive: responsive.value,
		loop: props.loop,
		center: props.centre || props.center,
		autoplayButtonOutput: false,
		gutter: props.gutter,
		edgePadding: props.edgePadding,
		fixedWidth: props.fixedWidth,
		autoWidth: props.autoWidth,
		autoHeight: props.autoHeight,
		controls: false,
		autoplayHoverPause: props.pauseOnHover,
		lazyload: props.lazy,
		lazyloadSelector: props.lazySelector,
		disable: props.disable
	});
});
onUnmounted(() => {
	if (instance.value?.destroy) {
		instance.value.destroy();
	}
});

/* *********************************************
 * EXPOSE
 * ******************************************* */
defineExpose({
	version: computed(() => instance.value.version),
	getInfo: computed(() => instance.value.getInfo),
	events: computed(() => instance.value.events),
	goTo: computed(() => instance.value.goTo),
	play: computed(() => instance.value.play),
	pause: computed(() => instance.value.pause),
	isOn: computed(() => instance.value.isOn),
	updateSliderHeight: computed(() => instance.value.updateSliderHeight),
	refresh: computed(() => instance.value.refresh),
	destroy: computed(() => instance.value.destroy),
	rebuild: computed(() => instance.value.rebuild)
});
</script>

<style lang="postcss">
@import "./tns/style.postcss";

.vue-tns-slider {
	img {
		max-height: 100%;
		overflow: hidden;
	}

	&__container {
		position: relative;
	}
	&__controls {
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		justify-content: space-between;
	}
	&__prev-button,
	&__next-button {
		position: relative;

		&::before {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			content: "";
			overflow: hidden;
			opacity: 0;
			background: currentColor;
			transition: opacity 300ms ease-in-out;
		}
		&:hover::before {
			opacity: 0.12;
		}
		&:active::before {
			opacity: 0.2;
		}
	}
	&__prev-button {
		transform: translateX(-100%);
	}
	&__next-button {
		transform: translateX(100%);
	}
	&__nav {
		display: flex;
		justify-content: center;
		column-gap: 4px;
	}
	&__nav-button {
		position: relative;

		&::before {
			position: absolute;
			content: "";
			top: -4px;
			bottom: -4px;
			left: -4px;
			right: -4px;
			border-radius: 50%;
			overflow: hidden;
			opacity: 0;
			background: currentColor;
			transition: opacity 300ms ease-in-out;
		}

		&:hover::before {
			opacity: 0.12;
		}
		&:active::before {
			opacity: 0.2;
		}
	}
}
</style>
