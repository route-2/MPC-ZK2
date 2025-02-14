/*
    Copyright 2018 0KIMS association.

    This file is part of circom (Zero Knowledge Circuit Compiler).

    circom is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    circom is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with circom. If not, see <https://www.gnu.org/licenses/>.
*/
pragma circom 2.0.0;

template MPC() {

    signal input in;
    signal output out;

    signal private s;

    component main = Main(in, s);
    component mpc = MPC(s, out);

    main.out <== mpc.out;
}

template Main(in, out) {
    signal input in;
    signal output out;

    out <== in;
}

template MPC(in, out) {
    signal input in;
    signal output out;

    out <== in;
}

template recover () {
   
}
