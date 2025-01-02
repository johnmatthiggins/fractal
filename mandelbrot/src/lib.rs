use js_sys::Int8Array;
use wasm_bindgen::prelude::*;

const MAX_ITERATIONS: i64 = 1000;
const PALETTE &'static [u8] = &[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200];

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

pub fn build_pixel(x0: f64, y0: f64) -> u8 {
    let mut x = 0;
    let mut y = 0;

    let mut iteration = 0;
    while x * x + y * y <= 4 && iteration < MAX_ITERATIONS {
        let xtmp = x * x - y * y + x0;
        y = 2 * x * y + y0;
        x = xtmp;

        iteration = iteration + 1;
    }

    PALETTE[iteration]
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
