use js_sys::Int8Array;
use wasm_bindgen::prelude::*;

const MAX_ITERATIONS: i64 = 1000;

#[wasm_bindgen]
pub fn add(left: u64, right: u64) -> u64 {
    left + right
}

#[wasm_bindgen]
pub fn generate_mandelbrot(
    top_left_x: f64,
    top_left_y: f64,
    bottom_right_x: f64,
    bottom_right_y: f64,
    viewport_height: u32,
    viewport_width: u32,
) -> Int8Array {
    let out: Vec<i8> = (0..10).collect();
    Int8Array::from(&out[..])
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
