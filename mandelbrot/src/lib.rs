use js_sys::Int16Array;
use wasm_bindgen::prelude::*;
use web_sys::console;

const MAX_ITERATIONS: usize = 1000;
const PALETTE: &'static [u8] = &[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200];

struct Point {
    x: f64,
    y: f64,
}

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
) -> Int16Array {
    console::log_1(&"Starting function".into());
    let mut output: Vec<i16> = vec![0; (viewport_width * viewport_height).try_into().unwrap()];
    console::log_1(&"Got past vector initialization".into());
    let top_left = Point {
        x: top_left_x,
        y: top_left_y,
    };
    let bottom_right = Point {
        x: bottom_right_x,
        y: bottom_right_y,
    };
    console::log_1(&"Got past initialization of structs".into());
    fill_screen(&mut output, viewport_width as usize, viewport_height as usize, top_left, bottom_right);
    Int16Array::from(&output[..])
}

fn fill_screen(
    screen_buffer: &mut Vec<i16>, 
    width: usize, 
    height: usize, 
    top_left: Point, 
    bottom_right: Point,
) {
    console::log_1(&"Successfully passed a vector...".into());
    let section_width: f64 = bottom_right.x - top_left.x;
    let section_height: f64 = bottom_right.y - top_left.y;

    let mut i: usize = 0;
    while i < width * height {
        console::log_1(&i.to_string().into());
        let x: usize =  i % width;
        let y: usize = i / height;
        let adjusted_x: f64 = (x as f64 / width as f64) * section_width;
        let adjusted_y: f64 = (y as f64 / height as f64) * section_height;
        console::log_1(&"Going into build_pixel function".into());
        let new_pixel = build_pixel(adjusted_x, adjusted_y, width);
        console::log_1(&"Passed build_pixel function".into());
        screen_buffer[i] = new_pixel as i16;

        i += 1;
    }
}

fn build_pixel(x0: f64, y0: f64, width: usize) -> u8 {
    let mut x: f64 = 0.0;
    let mut y: f64 = 0.0;

    let mut iteration: usize = 0;
    while x * x + y * y <= 4.0 && iteration < MAX_ITERATIONS {
        console::log_1(&iteration.to_string().into());
        let xtmp: f64 = x * x - y * y + x0;
        y = 2.0 * x * y + y0;
        x = xtmp;

        iteration = iteration + 1;
    }
    // let color: u8 = (u8)iteration;
    // let index = x0 * (width as f64) + y0;

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
