export default {
    preInputCalc(cptData, rlWaterTable) { 
        var depth, h, qc, qtn, n, qt, gtot, u0_kpa, sig_v0, sig_v0_prime, fs, fr_percent, lc, iz1;
         // todo: should do fancy input thing
        depth = []
        h = [] 
        qc = [];
        qt = [];
        gtot = [];
        u0_kpa = [];
        sig_v0 = [];
        sig_v0_prime = [];
        fs = [];
        fr_percent = [];
        n = [];
        lc = [];
        n = [];
        qtn = [];
        iz1 = [];

        const parsed_cpt_data = JSON.parse(JSON.stringify(cptData))
        let vals = this.populateCPTDataValues(parsed_cpt_data, 0); //tipdepth (used in h) does not matter for pre-input calc.
        depth = vals.depth;
        h = vals.h;
        qc = vals.qc;
        gtot = vals.gtot;
        fs = vals.fs;
        
        for (let i=0; i<depth.length; i++) {
            qt.push(this.getQt(qc[i]));
            u0_kpa.push(this.getU0Kpa(depth[i], rlWaterTable))
            sig_v0.push(this.getSigV0(depth[i], gtot[i], rlWaterTable))
            sig_v0_prime.push(this.getSigV0Prime(sig_v0[i], u0_kpa[i]))
            fr_percent.push(this.getFrPercent(fs[i], qc[i], sig_v0[i]));
            let iterative_values = this.getIterativeValues(qt[i], sig_v0[i], sig_v0_prime[i], fr_percent[i])
            
            qtn.push(iterative_values.qtn);
            lc.push(iterative_values.lc);
            n.push(iterative_values.n)
            iz1.push(this.getIz1(qtn[i], fr_percent[i]));
        }

        let cpt_dict_temp = []
        for (let i=0; i<depth.length; i++) {
            cpt_dict_temp.push({
                index: i,
                depth: depth[i],
                h: h[i],
                fr_percent: fr_percent[i],
                qt: qt[i],
                gtot: gtot[i],
                u0_kpa: u0_kpa[i],
                sig_v0: sig_v0[i],
                sig_v0_prime: sig_v0_prime[i],
                lc: lc[i],
                qtn: qtn[i],
                n: n[i],
                iz1: iz1[i]
            })
        }
        return cpt_dict_temp; //returns CPT data.
        //this.createCPTCharts();
    },
    processInputParameters(tip, tipdepth, cptData, nominalSizeDoN, rlWaterTable, pileEndCondition, pilePerimeter, nominalSizeT, pileShape, borehole) {
        var depth, h, qc, qt, gtot, u0_kpa, sig_v0, sig_v0_prime, fs, fr_percent, lc, n, qtn, bq, kc,iz1, qtc;
        depth = []
        h = [] 
        qc = [];
        qt = [];
        gtot = [];
        u0_kpa = [];
        sig_v0 = [];
        sig_v0_prime = [];
        fs = [];
        fr_percent = [];
        qtn = [];
        n = [];
        lc = [];
        bq = [];
        kc = [];
        iz1 = [];
        qtc = [];
        let tension_capacity = null;
        let compression_capacity = null; 

        const parsed_cpt_data = JSON.parse(JSON.stringify(cptData))
        let vals = this.populateCPTDataValues(parsed_cpt_data, tip); //tipdepth (used in h) does not matter for pre-input calc.
        depth = vals.depth;
        h = vals.h;
        qc = vals.qc;
        gtot = vals.gtot;
        fs = vals.fs;

        pilePerimeter = this.getPilePerimeter(pileShape, nominalSizeDoN)
        
        for (let i=0; i<depth.length; i++) {
            qt.push(this.getQt(qc[i]));
            u0_kpa.push(this.getU0Kpa(depth[i], rlWaterTable))
            sig_v0.push(this.getSigV0(depth[i], gtot[i], rlWaterTable))
            sig_v0_prime.push(this.getSigV0Prime(sig_v0[i], u0_kpa[i]))
            fr_percent.push(this.getFrPercent(fs[i], qc[i], sig_v0[i]));
            let iterative_values = this.getIterativeValues(qt[i], sig_v0[i], sig_v0_prime[i], fr_percent[i])
            qtn.push(iterative_values.qtn);
            lc.push(iterative_values.lc);
            n.push(iterative_values.n);
            bq.push(this.getBq(u0_kpa[i], qt[i], sig_v0[i])); 
            kc.push(this.getKc(lc[i]));
            qtc.push(this.getQtc(kc[i], qt[i]));
        }

        // base capacity calculation
        let qp = [] 
        let qb_sand = [];
        let qb_clay = [];
        let qp_clay = [];
        let qb1_clay = [];
        let qb1_sand = [];
        let qb1_adop = [];
        let qp_sand = [];
        let qb_final = [];
        let coe_casing = [];
        let delta_ord = []
        let orc = [];
        let tf_sand = [];
        let tf_clay = [];
        let tf_adop_tension = [];
        let tf_adop_compression = [];
        let qs_tension = [];
        let qs_compression = [];
        let qt_tension = [];
        let qt_compression = [];

        qp_clay = this.getQpClayArray(depth, qt, nominalSizeDoN, nominalSizeT);
        qp_sand = this.getQpSandArray(depth, qtc, nominalSizeDoN);

        let diameter = this.getDiameter(nominalSizeDoN, nominalSizeT)
        let ifr_value = this.getIFR(diameter)
        let are_value = this.getAr(pileEndCondition, nominalSizeDoN, ifr_value, diameter);
        //let area_value = this.getArea(nominalSizeDoN);
        let dstar_value = this.getDstar(pileEndCondition, nominalSizeDoN, diameter);
        let area_value = this.getAreaB(pileShape, nominalSizeDoN);
        for (let i = 0; i < depth.length; i++) {
            qp = this.getQpMixArray(qp_sand[i], qp_clay[i], lc[i]);
            
            //let ifr_value = 0.838 //todo: check if default value
            //let diameter = this.getDiameter(nominalSizeDoN, nominalSizeT) 
            //let are_value = this.getAr(pileEndCondition, nominalSizeDoN, ifr_value, diameter);
            //alert(are_value)
            //let area_value = this.getArea(nominalSizeDoN);
            //let dstar_value = this.getDstar(pileEndCondition, nominalSizeDoN);
            qb1_sand.push(this.getQb1Sand(are_value, qp_sand[i]) );
            qb1_clay.push(this.getQb1Clay(qp_clay[i], dstar_value, nominalSizeDoN))
            qb1_adop.push(this.getQb1Adop(lc[i], qb1_sand[i], qb1_clay[i]))
            qb_sand.push(this.getQbSand(qp[i], are_value, area_value));
            qb_clay.push(this.getQbClay(pileEndCondition, qt[i], area_value));
            //let area_b = this.getAreaB(pileShape, nominalSizeDoN);
            qb_final.push(this.getQbFinal(qb1_adop[i], area_value));
            coe_casing.push(this.getCoeCasing(depth[i], tip, borehole));
            // todo: figure out area vs area B.
            if (coe_casing[i] == 0) {
                delta_ord.push(0);
                orc.push(0);
                tf_sand.push(0);
                tf_adop_tension.push(0);
                tf_adop_compression.push(0);
            } else { 
              if (lc[i]<2.5) { // advanced: allow users to modify this
                delta_ord.push(this.getDeltaOrd(qtc[i], sig_v0_prime[i], nominalSizeDoN)) 
                orc.push(this.getOrc(qtc[i], are_value, nominalSizeDoN, h[i])) 
                tf_sand.push(this.getTfSand(coe_casing[i], delta_ord[i], orc[i]));
              } else {
                delta_ord.push(0);
                orc.push(0);
                tf_sand.push(0);
              }
            }
            tf_clay.push(this.getTfClay(qt[i], coe_casing[i], h[i], dstar_value));
            iz1.push(this.getIz1(qtn[i], fr_percent[i]));
            if (coe_casing[i] != 0) {
                tf_adop_tension.push(this.getTfAdopTension(iz1[i], tf_clay[i], tf_sand[i], lc[i]));
                tf_adop_compression.push(this.getTfAdopCompression(iz1[i], tf_clay[i], tf_sand[i], lc[i]));
            }
            let previousQsTension = i > 0 ? qs_tension[i-1] : 0; // todo: check if tension or compression.
            let previousQsCompression = i > 0 ? qs_compression[i-1] : 0; // todo: check if tension or compression.
            qs_tension.push(this.getQs(i, depth, tf_adop_tension[i], pilePerimeter, previousQsTension));
            qs_compression.push(this.getQs(i, depth, tf_adop_compression[i], pilePerimeter, previousQsCompression));
            qt_tension.push(this.getQtTension(qs_tension[i]));
            qt_compression.push(this.getQtCompression(qs_compression[i], qb_final[i]))
        }

         // calculate total capacity
        let qt_res= [];
        let qb = [];
        for (let i=0; i<depth.length; i++) {
            qb.push(this.getQb(qb_sand[i], qb_clay[i], lc[i]));
            qt_res.push(this.getQtRes(qs_tension[i], qb[i]))
        }

        // calcuate final results - TODO: edit this based on new spreadsheet
        //let lookup_index = depth.indexOf(tip)
        //let lookup_result = qs_tension[lookup_index]; // check if tension or compression
        //compression_capacity = (lookup_result/1500).toFixed(3) //todo: don't use 1500, final numbers are qs, qb and qt.
        //lookup_index = depth.indexOf(tip)
        //lookup_result = qt_res[lookup_index];
        //tension_capacity = (lookup_result/1500).toFixed(3) 
        tension_capacity = this.getTensionCapacityLookup(depth, tip, qs_tension);
        compression_capacity = this.getCompressionCapacityLookup(depth, tip, qs_compression, qb_final);

        //create dictionaries
        var param_dict_temp = [];
        var res_dict_temp = [];
        for (let i=0; i<depth.length; i++) {
        param_dict_temp.push({
            index: i,
            ifr_value: ifr_value, //todo: check if default value
            diameter: diameter,
            are_value: are_value,
            area_value: area_value,
            dstar_value: dstar_value,
            depth: depth[i],
            h: h[i],
            fr_percent: fr_percent[i],
            qt: qt[i],
            gtot: gtot[i],
            u0_kpa: u0_kpa[i],
            sig_v0: sig_v0[i],
            sig_v0_prime: sig_v0_prime[i],
            lc: lc[i],
            qtn: qtn[i],
            n: n[i],
            bq: bq[i],
            kc: kc[i],
            qtc: qtc[i]
        })


        res_dict_temp.push({
            index: i,
            depth: depth[i],
            fr: fr_percent[i], 
            delta_ord: delta_ord[i],
            orc: orc[i],
            tf_sand: tf_sand[i],
            tf_clay: tf_clay[i],
            tf_adop_tension: tf_adop_tension[i],
            tf_adop_compression: tf_adop_compression[i],
            iz1: iz1[i],
            lc: lc[i],
            qs_tension: qs_tension[i],
            qs_compression: qs_compression[i],
            qb1_clay: qb1_clay[i],
            qb1_sand: qb1_sand[i],
            qp_clay: qp_clay[i],
            qp_sand: qp_sand[i],
        })

        }
        // todo: remove - for debugging
        localStorage.param_dict = JSON.stringify(param_dict_temp);
        localStorage.res_dict = JSON.stringify(res_dict_temp);
        return {'tipdepth': tip, 'tension_capacity': tension_capacity, 'compression_capacity': compression_capacity};
    },
    populateCPTDataValues(parsed_cpt_data, tipdepth)  {
        let depth = []
        let h = [] 
        let qc = [];
        let fs = [];
        let gtot = [];
        for (const row of parsed_cpt_data) {
        
            let depth_value = parseFloat(row[0]);
            depth.push(depth_value);
            
            h.push(tipdepth - depth_value); 
        
            let qc_value = parseFloat(row[1]); 
            qc.push(qc_value);
        
            let fs_value = parseFloat(row[2])
            fs.push(fs_value);
        
            // advanced: add U2

            let gtot_value = parseFloat(row[3]) 
            gtot.push(gtot_value);
        }

        return {
            depth: depth,
            h: h,
            qc: qc,
            fs: fs,
            gtot: gtot
        }
    },
    getQt(qc_value) {
        return qc_value; // advanced correct qt with u2
    },
    getU0Kpa(depth_value, rlWaterTable) {
        if (depth_value<rlWaterTable) { 
            return 0;
        } else {
            return (depth_value-rlWaterTable)*9.81 
        }
    },
    getSigV0(depth_value, gtot_value, rlWaterTable) {
        if (rlWaterTable < 0) {
            return depth_value*gtot_value+(Math.abs(rlWaterTable)*9.81); 
        } else {
            return depth_value*gtot_value;
        }
    },
    getSigV0Prime(sig_v0_value, u0_value) {
        return sig_v0_value - u0_value;
    },
    getFrPercent(fs_value, qc_value, sig_v0_value) {
        return fs_value/(qc_value*1000-sig_v0_value)*100
    },
    /*getIterativeValuesNew(qt_value, sig_v0_value, sig_v0_prime_value, fr_percent_value) {
        let ntrial = 0
        let n = 0
        let qnet = 
        let pa =
        let sevo = 
        //let Q = (qnet / pa) * (pa / sevo)
        if (Rf = 0) {
            Ic = 0 
        } else {
            Ic = ((3.47 - Application.WorksheetFunction.Log(Q)) ^ 2 + (1.22 + Application.WorksheetFunction.Log(Rf)) ^ 2) ^ 0.5
        }
        ntrial = 0.381 * Ic + 0.05 * (sevo / pa) - 0.15
        err = Abs(ntrial - n)
        while (err > 0.001) {
            Qtn = (qnet / pa) * (pa / sevo) ^ ntrial
            if (Rf = 0) {
                Ic = 0 
            } else {
                Ic = ((3.47 - Application.WorksheetFunction.Log(Qtn)) ^ 2 + (1.22 + Application.WorksheetFunction.Log(Rf)) ^ 2) ^ 0.5
            }
        }
        n = Math.min(1, 0.381 * Ic + 0.05 * (sevo / pa) - 0.15)
        err = Math.abs(ntrial - n)
        ntrial = n
    },*/
    getDiameter(nominalSizeDoN, t_value) {
        return nominalSizeDoN-2*t_value/1000
    },
    getIterativeValues(qt_value, sig_v0_value, sig_v0_prime_value, fr_percent_value) {
        let ntrial = 0
        let n = 0
        let lc = 0
        let qtn = 0;
        if (fr_percent_value == 0) {
            lc = 0;
        } else {
            lc = this.getLc(qt_value, fr_percent_value) //todo: check this
        }
        ntrial = this.getN(lc, sig_v0_prime_value)
        let err = Math.abs(ntrial - n)
        while (err > 0.001) {
            qtn = this.getQtn(qt_value, sig_v0_value, sig_v0_prime_value, ntrial)
            if (fr_percent_value == 0) {
                lc = 0;
            } else {
                lc = this.getLc(qtn, fr_percent_value)
            }
            n =  Math.min(1, this.getN(lc, fr_percent_value))
            err = Math.abs(ntrial - n)
            ntrial = n
        }
        return {
            qtn: qtn,
            lc: lc,
            n: n
        }

    },
    /*getIterativeValues(qt_value, sig_v0_value, sig_v0_prime_value, fr_percent_value) {
        let flag = 0;
        let n_estimate = 0.01;
        let n_value = 0;
        let lc_value = 0;
        for (let j=1; j <= 10000; j++) {
            if (flag == 0) {
            let qtn_value = this.getQtn(qt_value, sig_v0_value, sig_v0_prime_value, n_estimate)
            lc_value = this.getLc(qtn_value, fr_percent_value)
            n_value = this.getN(lc_value, sig_v0_prime_value)
            if (n_value > 1) {n_value == 1.00}
                if (Math.abs(n_estimate - n_value) < 0.001) { 
                    flag = 1;
                    return {
                        qtn: qtn_value,
                        lc: lc_value,
                        n: n_value
                    }
                } else {
                n_estimate = n_estimate + 0.001
                }
            } else {
                console.log('iterative values could not converge')
                break; // todo: what to do if it never converges?
            }
            }
            console.log('iterative values could not converge')
        }, */
    getQtn(qt_value, sig_v0_value, sig_v0_prime_value, n_estimate) {
     return ((1000*qt_value-sig_v0_value)/100)*Math.pow((100/sig_v0_prime_value),n_estimate); //todo: check if qc or qt
    },
    getLc(qtn_value, fr_percent_value) {
     return Math.pow((Math.pow((3.47-Math.log10(qtn_value)), 2) + Math.pow((Math.log10(fr_percent_value)+1.22), 2)), 0.5)
    },
    getN(lc_value, sig_v0_prime_value) {
      return 0.381*lc_value+0.05*(sig_v0_prime_value/100)-0.15;
    },
    getBq(u0_value, qt_value, sig_v0_value) {
        return ((-u0_value)/(qt_value*1000-sig_v0_value)) //advanced: correct this with u2
    },
    getKc(lc_value) {
        if (lc_value < 2.05) { //advanced: allow users to modify this value
          return 1;
        } else if (lc_value > 2.5) { //advanced: allow users to modify this value
          return 1;
        } else { //todo: check if 3.93 or 3.96
          return 3.93*Math.pow(lc_value, 2)-14.78*lc_value+14.78;
        }
    },
    getQtc(kc_value, qt_value) {
        return kc_value*qt_value;
    },
    getQpMixArray(qp_sand, qp_clay, lc) { 
        if (lc > 2.5) { //if clay, allow modification in advanced
            return qp_clay;
        }
        return qp_sand; 

    },
    getQpClayArray(depthArray, qtArray, nominalSizeDoN, nominalSizeT) {
        let diameter = nominalSizeDoN;
        let t = nominalSizeT / 1000;
        let qpArray = [];

        for (let i=0; i< depthArray.length; i++) {
            let depth = depthArray[i];
            let deltaz = 0
            if (i == depthArray.length - 1) {
                // todo: figure out what to do at end of array.
                deltaz = 0 
            } 
            deltaz = depthArray[i+1] - depthArray[i]
            let avgcells = 20*t / deltaz //% in macro casts to integer
            let qpc = 0;
            if (depth > (8*diameter)) {
                let qtsum = 0;
                let n = 0;
                let j = i - Math.round(avgcells);
                while (j <= (i+avgcells)) {
                    let qt = qtArray[j];
                    if (typeof qt == 'undefined') {
                        qpc = 0;
                    }
                    else if (qt > 0) {

                        qtsum = qt + qtsum;
                        n = n + 1
                    }
                    qpc = qtsum / n;
                    j = j+1;
                }
            } else {
                qpc = 0;
            }
            qpArray.push(qpc);
        }
        return qpArray;
    },
    getQpSandArray(depthArray, qtArray, nominalSizeDoN) {

        // note small precision error at 2.6

        let diameter = nominalSizeDoN;
        let qpArray = [];

        for (let i=0; i< depthArray.length; i++) {
            let depth = depthArray[i];
            let deltaz = 0
            if (i == depthArray.length - 1) {
                // todo: figure out what to do at end of array.
                deltaz = 0 
            } 
            deltaz = depthArray[i+1] - depthArray[i]
            let avgcells = Math.round(1.5*diameter / deltaz)//% in macro casts to integer
            let qpc = 0;
            if (depth > (8*diameter)) {
                let qtsum = 0;
                let n = 0;
                let j = i - avgcells;
                let avg_array = [];
                while (j <= (i+avgcells)) {
                    let qt = qtArray[j];
                    avg_array.push(qt)
                    if (typeof qt == 'undefined') {
                        qpc = 0;
                    }
                    else if (qt > 0) {
                        qtsum = qt + qtsum;
                        n = n + 1
                    }
                    qpc = qtsum / n;
                    j = j+1;
                }
            } else {
                qpc = 0;
            }
            qpArray.push(qpc);
        }
        //console.log('sand')
        //console.log(qpArray);
        return qpArray;
    },
    getAr(pileEndCondition, nominalSizeDoN, ifr_value, diameter) {
        if (pileEndCondition != 1) { //closed
        // return 1-0.980*(Math.pow(nominalSizeDoN-2*11.176/1000, 2))/(Math.pow(nominalSizeDoN, 2)); //TODO:figure out what 11.176 is and CALC 0.980
            return 1 - ifr_value*(Math.pow((diameter/nominalSizeDoN), 2))
        } else {
            return 1;
        }

    },
    getArea(nominalSizeDoN) {
        return Math.PI*nominalSizeDoN*nominalSizeDoN*0.25; 
    },
    getQbSand(qp_value, ar_value, area_value) {
        return qp_value*1000*(0.15+0.45*ar_value)*area_value;
    },
    getQbClay(pileEndCondition, qt_value, area_value) {
        if (pileEndCondition == 1) { //closed
          return (0.8*qt_value*1000)*area_value;
        } else {
          return (0.4*qt_value*1000)*area_value;
        }

    },
    getQb1Sand(are_value, qp_sand) {
        return (0.12+0.38*are_value)*qp_sand
    },
    getQb1Clay(qp_clay, d_star, nominalSizeDoN) {

        return qp_clay*(0.2+0.6*Math.pow(d_star/nominalSizeDoN, 2))
    },
    getQb1Adop(lc_value, qb1_sand, qb1_clay) {
        if (lc_value > 2.5) { // if clay or zone, allow user to modify this 
            return qb1_clay
        } else {
            return qb1_sand
        }
    },
    getDstar(pileEndCondition, nominalSizeDoN, diameter) {
        if (pileEndCondition == 1) { //closed
            return nominalSizeDoN;
        } else {
            return Math.sqrt(Math.pow(nominalSizeDoN, 2)- Math.pow(diameter, 2));
        }
    },
    getCoeCasing(depth, tip, borehole) {
        if (depth < borehole)
            return 0
        else if (depth >= borehole && depth <= tip) {
            return 1
        } else {
            return 0
        }
    },
    getDeltaOrd(qtc_value, sig_v0_prime_value, nominalSizeDoN) {
        let delta_ord_value = (1000*qtc_value*0.1)*Math.pow((1000*qtc_value/sig_v0_prime_value), -0.33)*(35.7/(1000*nominalSizeDoN))
        if (delta_ord_value.toString() == "NaN") { //todo: figure out what to do if imaginary number
           delta_ord_value = 0;
        }
        return delta_ord_value;
    },
    getQbFinal(qb1_adop, area_b) {
        return qb1_adop*1000*area_b;
    },
    getOrc(qtc_value, are_value, nominalSizeDoN, h_value) {
        return ((qtc_value*1000)/44)*Math.pow(are_value, 0.3)*Math.pow(Math.max(1, (h_value/nominalSizeDoN)), -0.4)  
    },
    getTfSand(coe_casing_value, delta_ord_value, orc_value) {
        return coe_casing_value*(delta_ord_value+orc_value)*0.554
    },
    getTfClay(qt_value, coe_casing_value, h_value, dstar_value) {
        return 0.07*qt_value*1000*coe_casing_value*Math.pow(Math.max(1,h_value/dstar_value), -0.25)
    },
    getIz1(qtn_value, fr_percent_value) {
        return qtn_value-12*Math.exp(-1.4*fr_percent_value)
    },
    getTfAdopTension(iz1_value, tf_clay_value, tf_sand_value, lc_value) {
        if (iz1_value<0) { 
            return 0.5*tf_clay_value;
          } else {
            if(lc_value>2.5) { // advanced: allow user to modify this.
              return tf_clay_value;
            } else {
              return 0.75*tf_sand_value;
            }
          }
    },
    getTfAdopCompression(iz1_value, tf_clay_value, tf_sand_value, lc_value) {
        if (iz1_value<0) { 
            return 0.5*tf_clay_value;
          } else {
            if(lc_value>2.5) { // advanced: allow user to modify this.
              return tf_clay_value;
            } else {
              return tf_sand_value;
            }
          }
    },
    getAreaB(pileShape, nominalSizeDoN) {
        if (pileShape == 0) { //zero is circular
            return Math.PI*nominalSizeDoN*nominalSizeDoN*0.25
        }
        return nominalSizeDoN*nominalSizeDoN;
    },
    getQs(i, depth, tf_adop_value, pilePerimeter, previousQs) {
        let delta_z = 0;
        if (i == 0) {
          delta_z = depth[i]-0
          return tf_adop_value*pilePerimeter*(delta_z)+0 
        } else {
          delta_z = depth[i]-depth[i-1]
          return tf_adop_value*pilePerimeter*(delta_z)+previousQs
        }
    },
    getQb(qb_sand_value, qb_clay_value, lc_value) {
        if (lc_value < 2.05) { // advanced: allow user to modify this (this is when it is sand)
            return qb_sand_value;
        } else {
            return qb_clay_value;
        }
    },
    getQtRes(qs_value, qb_value) {
        return qs_value+qb_value
    },
    getPilePerimeter(pileShape, nominalSizeDoN) {
        if (pileShape == 0) { //zero is circular {
            return Math.PI*nominalSizeDoN;
        } else {
            return nominalSizeDoN*4
        }

    },
    getQtCompression(qs_compression, qb_final) {
        return qs_compression + qb_final;
    },
    getQtTension(qs_tension) {
        return qs_tension;
    },
    getTensionCapacityLookup(depthArray, tip, qs_tension) {
        let lookup_index = depthArray.indexOf(tip);
        let lookup_result = qs_tension[lookup_index];
        return lookup_result;
    },
    getCompressionCapacityLookup(depthArray, tip, qs_compression, qb_final) {
        let qs = 0;
        let lookup_index = depthArray.indexOf(tip);
        qs = qs_compression[lookup_index];
        let qb = 0;
        qb = qb_final[lookup_index];
        return qs + qb;
    },
    getIFR(diameter) {
        return Math.tanh(0.3*(Math.pow(diameter*1000/35.68, 0.5)))
    },
    log(base, number) {
        return Math.log(number) / Math.log(base);
    }
}


