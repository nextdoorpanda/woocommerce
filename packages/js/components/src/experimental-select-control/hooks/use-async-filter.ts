/**
 * External dependencies
 */
import { useDebounce } from '@wordpress/compose';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { SelectControlProps } from '../select-control';

export const DEFAULT_DEBOUNCE_TIME = 250;

export default function useAsyncFilter< T >( {
	filter,
	onFilterStart,
	onFilterEnd,
	onInputChange,
	debounceTime = DEFAULT_DEBOUNCE_TIME,
	...props
}: UseAsyncFilterInput< T > ): SelectControlProps< T > {
	const handleInputChange = useCallback(
		function handleInputChangeCallback( value?: string ) {
			if ( onFilterStart ) onFilterStart( value );
			filter( value )
				.then( ( filteredItems ) => {
					if ( onFilterEnd ) onFilterEnd( filteredItems, value );
				} )
				.catch( () => {
					if ( onFilterEnd ) onFilterEnd( [], value );
				} )
				.finally( () => {
					if ( onInputChange ) onInputChange( value );
				} );
		},
		[ filter, onFilterStart, onFilterEnd, onInputChange ]
	);

	return {
		...props,
		onInputChange: useDebounce( handleInputChange, debounceTime ),
	};
}

export type UseAsyncFilterInput< T > = SelectControlProps< T > & {
	filter( value?: string ): Promise< T[] >;
	onFilterStart?( value?: string ): void;
	onFilterEnd?( filteredItems: T[], value?: string ): void;
	debounceTime?: number;
};