import { computed, toRef } from "vue";
import { availableBreakpoints } from "vue3-mq";
import { mapKeys } from "lodash-es";

export const useResponsiveConfig = (props) => {
    const responsive = toRef(props, "responsive");

    return computed(() =>
        mapKeys(responsive.value, function (value, key) {
            const found =
                typeof key === "string" &&
                availableBreakpoints.value?.length &&
                availableBreakpoints.value.find((bp) => bp.name === key);
            return found ? found.min : key;
        })
    );
};
